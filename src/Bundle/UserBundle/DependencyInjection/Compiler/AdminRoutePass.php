<?php

namespace gita\Bundle\UserBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;

class AdminRoutePass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $definition = $container->getDefinition('gita.system.application.admin');
        $definition->addMethodCall('addRouteResources', ['@UserBundle/Resources/config/routing/admin.xml', 'xml']);
    }
}
