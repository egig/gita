<?php

namespace gita\Bundle\BlogBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use gita\Bundle\BlogBundle\Entity\Post;
use gita\Bundle\BlogBundle\Model\Revision;
use cogpowered\FineDiff\Granularity\Character as CharacterGranularity;
use cogpowered\FineDiff\Render\Html as HtmlRenderer;
use cogpowered\FineDiff\Diff;

class RevisionController extends Controller
{
    /**
     * @Template()
     */
    public function viewAction($postId)
    {
        $repo = $this->getDoctrine()->getManager()->getRepository('BlogBundle:Post');

        $revs = $repo->createQueryBuilder('p')
            ->where('p.type = :type')
            ->orderBy('p.createdAt', 'desc')
            ->setParameter('type', 'history:'.$postId)
            ->getQuery()
            ->getResult();

        $current = $repo->find($postId);

        for ($i = 0;$i < count($revs);++$i) {
            $new = ($i - 1 < 0) ? $current : $revs[$i - 1];
            $old = $revs[$i];

            $revs[$i]->diff_title = (new Diff())->render($old->getTitle(), $new->getTitle());

            $granularity = new CharacterGranularity();
            $renderer = new HtmlRenderer();
            $diff_content = (new Diff($granularity, $renderer))->render($old->getContent(), $new->getContent());

            // add line spacing between paragraph
            $revs[$i]->diff_content = str_replace('&lt;/p&gt;', '&lt;/p&gt;<br/><br/>', $diff_content);

            $revs[$i]->authorUrl = $this->generateUrl('dt_user_edit', ['id' => $revs[$i]->getUser()->getId()]);
            $revs[$i]->pos = count($revs) - $i;
        }

        $postUrl = '<a href="'.$this->generateUrl('dt_blog_post_edit', ['id' => $current->getId()]).'">'.$current->getTitle().'</a>';

        return [
            'post_id' => $postId,
            'revs' => $revs,
            'page_title' => $this->get('translator')->trans('Revisions of %post%', ['%post%' => $postUrl]),
        ];
    }

    public function clearAction(Request $request)
    {
        $postId = $request->request->get('id');

        $em = $this->getDoctrine()->getManager();
        $revs = $em->getRepository('BlogBundle:Post')->findby(['type' => 'history:'.$postId]);

        foreach ($revs as $rev) {
            $em->remove($rev);
        }

        $em->flush();

        // @todo
        return new Response();
    }

    public function revertAction(Request $request)
    {
        $id = $request->request->get('id');
        $postId = $request->request->get('post-id');

        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('BlogBundle:Post');

        $rev = $repo->find($id);

        $title = $rev->getTitle();
        $content = $rev->getContent();

        $post = $repo->find($postId);

        (new Revision($this))->create($post->getTitle(), $post->getContent(), $post, true);

        $post->setTitle($title);
        $post->setContent($content);

        $em->persist($post);
        $em->flush();

        return $this->redirect($this->generateUrl('dt_blog_post_edit', ['id' => $postId]));
    }
}
