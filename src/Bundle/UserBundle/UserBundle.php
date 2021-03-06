<?php

namespace gita\Bundle\UserBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use gita\Bundle\UserBundle\DependencyInjection\Compiler\AdminRoutePass;

class UserBundle extends Bundle
{
    public function getParent()
    {
        return 'FOSUserBundle';
    }

    public function build(ContainerBuilder $container)
    {
        parent::build($container);
        $container->addCompilerPass(new AdminRoutePass());
    }
}
