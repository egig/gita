<?php

namespace gita\Bundle\BlogBundle\System\Setting;

use gita\Core\Setting\Field;
use gita\Bundle\BlogBundle\Form\Type\SettingType;

class BlogField extends Field
{
    public function getFormType()
    {
        return SettingType::class;
    }

    public function getTemplate()
    {
        return 'BlogBundle:Setting/Field:blog.html.twig';
    }

    public function getName()
    {
        return 'blog';
    }
}
