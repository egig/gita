<?php

namespace gita\Bundle\BlogBundle\System\Extension;

use gita\Core\Extension\Extension;
use gita\Bundle\BlogBundle\System\Shortcut\NewPostShortcut;

class BlogExtension extends Extension
{
    public function getName()
    {
        return 'blog';
    }

    public function getShortcuts()
    {
        return [
            new NewPostShortcut(),
        ];
    }
}
