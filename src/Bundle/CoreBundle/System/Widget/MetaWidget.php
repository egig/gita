<?php

namespace gita\Bundle\CoreBundle\System\Widget;

use Symfony\Component\Form\Form;
use gita\Core\Widget\Widget;

class MetaWidget extends Widget
{
    public function getName()
    {
        return 'meta';
    }

    public function run($context = null)
    {
        $baseUrl = $this->container->get('request_stack')->getCurrentRequest()->getBaseUrl();
        $admin = $this->container->getParameter('admin');
        $items = [
            ['link' => $baseUrl.'/'.$admin, 'label' => 'Site Admin'],
            ['link' => 'http://gita', 'label' => 'gita.org'],
        ];

        $data['items'] = $items;

        return $this->container->get('templating')->render('widgets/meta.html.twig', $data);
    }

    public function buildForm(Form $form)
    {
        return $form;
    }
}
