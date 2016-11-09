<?php

namespace gita\Bundle\BlogBundle\System\Routing;

use gita\Core\Application;
use gita\Core\FrontPageApplicationInterface;

class Blog extends Application implements FrontPageApplicationInterface
{
    public function getRoutePrefix()
    {
        return 'blog';
    }

    public function getRouteResources()
    {
        return ['xml' => ['@BlogBundle/Resources/config/routing/blog.xml']];
    }

    public function getOptions()
    {
        return ['Blog' => 'blog'];
    }

    public function getName() {
        return "Blog";
    }

    public function getBasePath() {
        return $this->getRoutePrefix();
    }
}
