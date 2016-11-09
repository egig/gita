<?php

namespace gita\Bundle\CoreBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;

class AdminRoutePass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $definition = $container->getDefinition('gita.system.application.admin');
        $definition->addMethodCall('addRouteResources', ['@CoreBundle/Resources/config/routing/admin.xml', 'xml']);
    }
}
