<?php

namespace gita\Bundle\CoreBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;

class AddThemePathPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $definition = $container->getDefinition('gita.theme_manager');

        $appThemePath = $container->getParameter("themes_path");
        $definition->addMethodCall('addPath', [$appThemePath]);
    }
}
