<?php

namespace gita\Bundle\CoreBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\Reference;

class ApplicationRoutePass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        if (!$container->hasDefinition('gita.system.application_manager')) {
            return;
        }

        $definition = $container->getDefinition(
            'gita.system.application_manager'
        );

        $taggedServices = $container->findTaggedServiceIds(
            'gita.system.application'
        );

        foreach ($taggedServices as $id => $tags) {
            $definition->addMethodCall(
                'register',
                array(new Reference($id))
            );
        }
    }
}
