<?php

namespace gita\Bundle\CoreBundle\System\Setting;

use gita\Core\Setting\Field;
use gita\Bundle\CoreBundle\Form\Type\SystemType;

class GeneralField extends Field
{
    public function getFormType()
    {
        return SystemType::class;
    }

    public function getTemplate()
    {
        return 'CoreBundle:Setting/Field:system.html.twig';
    }

    public function getName()
    {
        return 'system';
    }
}
