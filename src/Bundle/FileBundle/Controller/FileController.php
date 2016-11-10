<?php

namespace gita\Bundle\FileBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use elFinder;

class FileController extends Controller
{
    /**
     * @Template()
     */
    public function indexAction()
    {
        return [
            'view_id' => 'file',
            'locale' => $this->container->getParameter('locale'),
            'page_title' => $this->get('translator')->trans('File'),
        ];
    }

    /**
     * @Template()
     */
    public function browserAction()
    {
        // @todo filter browser to diplay only image on ckeditor
        return [
            'locale' => $this->container->getParameter('locale'),
        ];
    }

    public function dataAction(Request $request)
    {

      require $this->getParameter("kernel.root_dir").'/../vendor/web/elfinder/php/autoload.php';

      $opts = static::getOptions($this);

      $this->elFinder  = new elFinder($opts);
      $this->reqMethod = strtoupper($_SERVER["REQUEST_METHOD"]);
      $this->header = 'Content-Type: application/json';

      return $this->run();
    }

    public function run() {
  		$isPost = $this->reqMethod === 'POST';
  		$src    = $isPost ? $_POST : $_GET;
  		if ($isPost && !$src && $rawPostData = @file_get_contents('php://input')) {
  			// for support IE XDomainRequest()
  			$parts = explode('&', $rawPostData);
  			foreach($parts as $part) {
  				list($key, $value) = array_pad(explode('=', $part), 2, '');
  				$key = rawurldecode($key);
  				if (substr($key, -2) === '[]') {
  					$key = substr($key, 0, strlen($key) - 2);
  					if (!isset($src[$key])) {
  						$src[$key] = array();
  					}
  					$src[$key][] = rawurldecode($value);
  				} else {
  					$src[$key] = rawurldecode($value);
  				}
  			}
  			$_POST = $this->input_filter($src);
  			$_REQUEST = $this->input_filter(array_merge_recursive($src, $_REQUEST));
  		}
  		$cmd    = isset($src['cmd']) ? $src['cmd'] : '';
  		$args   = array();

  		if (!function_exists('json_encode')) {
  			$error = $this->elFinder->error(elFinder::ERROR_CONF, elFinder::ERROR_CONF_NO_JSON);
  			return $this->output(array('error' => '{"error":["'.implode('","', $error).'"]}', 'raw' => true));
  		}

  		if (!$this->elFinder->loaded()) {
  			return $this->output(array('error' => $this->elFinder->error(elFinder::ERROR_CONF, elFinder::ERROR_CONF_NO_VOL), 'debug' => $this->elFinder->mountErrors));
  		}

  		// telepat_mode: on
  		if (!$cmd && $isPost) {
  			return $this->output(array('error' => $this->elFinder->error(elFinder::ERROR_UPLOAD, elFinder::ERROR_UPLOAD_TOTAL_SIZE), 'header' => 'Content-Type: text/html'));
  		}
  		// telepat_mode: off

  		if (!$this->elFinder->commandExists($cmd)) {
  			return $this->output(array('error' => $this->elFinder->error(elFinder::ERROR_UNKNOWN_CMD)));
  		}

  		// collect required arguments to exec command
  		$hasFiles = false;
  		foreach ($this->elFinder->commandArgsList($cmd) as $name => $req) {
  			if ($name === 'FILES') {
  				if (isset($_FILES)) {
  					$hasFiles = true;
  				} elseif ($req) {
  					return $this->output(array('error' => $this->elFinder->error(elFinder::ERROR_INV_PARAMS, $cmd)));
  				}
  			} else {
  				$arg = isset($src[$name])? $src[$name] : '';

  				if (!is_array($arg) && $req !== '') {
  					$arg = trim($arg);
  				}
  				if ($req && $arg === '') {
  					return $this->output(array('error' => $this->elFinder->error(elFinder::ERROR_INV_PARAMS, $cmd)));
  				}
  				$args[$name] = $arg;
  			}
  		}

  		$args['debug'] = isset($src['debug']) ? !!$src['debug'] : false;

  		$args = $this->input_filter($args);
  		if ($hasFiles) {
  			$args['FILES'] = $_FILES;
  		}

  		return $this->output($this->elFinder->exec($cmd, $args));
  	}

    /**
     * Output json
     *
     * @param  array  data to output
     * @return void
     * @author Dmitry (dio) Levashov
     **/
    protected function output(array $data) {

      $response = new Response();
      $response->headers->set('Content-Type', 'text/html');
      $response->send();

      $header = isset($data['header']) ? $data['header'] : $this->header;
      unset($data['header']);
      if ($header) {
        if (is_array($header)) {
          foreach ($header as $h) {
            header($h);
          }
        } else {
          header($header);
        }
      }

      if (isset($data['pointer'])) {
        $toEnd = true;
        $fp = $data['pointer'];
        if (($this->reqMethod === 'GET' || $this->reqMethod === 'HEAD')
            && elFinder::isSeekableStream($fp)
            && (array_search('Accept-Ranges: none', headers_list()) === false)) {
          header('Accept-Ranges: bytes');
          $psize = null;
          if (!empty($_SERVER['HTTP_RANGE'])) {
            $size = $data['info']['size'];
            $start = 0;
            $end = $size - 1;
            if (preg_match('/bytes=(\d*)-(\d*)(,?)/i', $_SERVER['HTTP_RANGE'], $matches)) {
              if (empty($matches[3])) {
                if (empty($matches[1]) && $matches[1] !== '0') {
                  $start = $size - $matches[2];
                } else {
                  $start = intval($matches[1]);
                  if (!empty($matches[2])) {
                    $end = intval($matches[2]);
                    if ($end >= $size) {
                      $end = $size - 1;
                    }
                    $toEnd = ($end == ($size - 1));
                  }
                }
                $psize = $end - $start + 1;

                header('HTTP/1.1 206 Partial Content');
                header('Content-Length: ' . $psize);
                header('Content-Range: bytes ' . $start . '-' . $end . '/' . $size);

                fseek($fp, $start);
              }
            }
          }
          if (is_null($psize)){
            elFinder::rewind($fp);
          }
        } else {
          header('Accept-Ranges: none');
          if (isset($data['info']) && ! $data['info']['size']) {
            if (function_exists('header_remove')) {
              header_remove('Content-Length');
            } else {
              header('Content-Length:');
            }
          }
        }

        // unlock session data for multiple access
        $this->elFinder->getSession()->close();
        // client disconnect should abort
        ignore_user_abort(false);

        if ($reqMethod !== 'HEAD') {
          if ($toEnd) {
            fpassthru($fp);
          } else {
            $out = fopen('php://output', 'wb');
            stream_copy_to_stream($fp, $out, $psize);
            fclose($out);
          }
        }

        if (!empty($data['volume'])) {
          $data['volume']->close($data['pointer'], $data['info']['hash']);
        }
        exit();
      } else {
        if (!empty($data['raw']) && !empty($data['error'])) {

          $response->setContent($data['error']);
          return $response;

        } else {
          if (isset($data['debug']) && isset($data['debug']['phpErrors'])) {
            $data['debug']['phpErrors'] = array_merge($data['debug']['phpErrors'], elFinder::$phpErrors);
          }

          $response->setContent(json_encode($data));
          return $response;
        }
      }
    }

    /**
     * Get options
     *
     * @return array
     */
     private function getOptions()
     {
         // Documentation for connector options:
         // https://github.com/Studio-42/elFinder/wiki/Connector-configuration-options
         $opts = array(
         	// 'debug' => true,
         	'roots' => array(
         		array(
         			'driver'        => 'LocalFileSystem',           // driver for accessing file system (REQUIRED)
         			'path'          => $this->getParameter("kernel.root_dir").'/../web/files/',                 // path to files (REQUIRED)
         			'URL'           => '/files/', // URL to files (REQUIRED)
         			'uploadDeny'    => array('all'),                // All Mimetypes not allowed to upload
         			'uploadAllow'   => array('image', 'text/plain'),// Mimetype `image` and `text/plain` allowed to upload
         			'uploadOrder'   => array('deny', 'allow'),      // allowed Mimetype `image` and `text/plain` only
         			'accessControl' => get_class($this).'::access'                     // disable and hide dot starting files (OPTIONAL)
         		)
         	)
         );

         return $opts;
     }

     /**
      * Simple function to demonstrate how to control file access using "accessControl" callback.
      * This method will disable accessing files/folders starting from '.' (dot)
      *
      * @param  string  $attr  attribute name (read|write|locked|hidden)
      * @param  string  $path  file path relative to volume root directory started with directory separator
      * @return bool|null
      **/
     private static function access($attr, $path, $data, $volume) {
     	return strpos(basename($path), '.') === 0       // if file/folder begins with '.' (dot)
     		? !($attr == 'read' || $attr == 'write')    // set read+write to false, other (locked+hidden) set to true
     		:  null;                                    // else elFinder decide it itself
     }

     /**
      * Remove null & stripslashes applies on "magic_quotes_gpc"
      *
      * @param  mixed  $args
      * @return mixed
      * @author Naoki Sawada
      */
     protected function input_filter($args) {
       static $magic_quotes_gpc = NULL;

       if ($magic_quotes_gpc === NULL)
         $magic_quotes_gpc = (version_compare(PHP_VERSION, '5.4', '<') && get_magic_quotes_gpc());

       if (is_array($args)) {
         return array_map(array(& $this, 'input_filter'), $args);
       }
       $res = str_replace("\0", '', $args);
       $magic_quotes_gpc && ($res = stripslashes($res));
       return $res;
     }
}
