<?php

namespace gita\Bundle\CoreBundle\System\Routing;

use gita\Core\Application;

class Admin extends Application
{
    public function getRoutePrefix()
    {
        return 'admin';
    }
}
