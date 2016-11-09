<?php

namespace gita\Bundle\CoreBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use gita\Bundle\CoreBundle\DependencyInjection\Compiler\LogDisplayFormatterPass;
use gita\Bundle\CoreBundle\DependencyInjection\Compiler\ApplicationRoutePass;
use gita\Bundle\CoreBundle\DependencyInjection\Compiler\DashboardPass;
use gita\Bundle\CoreBundle\DependencyInjection\Compiler\WidgetPass;
use gita\Bundle\CoreBundle\DependencyInjection\Compiler\SearchQueryProviderPass;
use gita\Bundle\CoreBundle\DependencyInjection\Compiler\SettingFieldPass;
use gita\Bundle\CoreBundle\DependencyInjection\Compiler\WebDebugToolbarPass;
use gita\Bundle\CoreBundle\DependencyInjection\Compiler\AdminRoutePass;
use gita\Bundle\CoreBundle\DependencyInjection\Compiler\AddThemePathPass;

class CoreBundle extends Bundle
{
    const NAVIGATION = 'system.navigation';

    public function build(ContainerBuilder $container)
    {
        parent::build($container);
        $container->addCompilerPass(new LogDisplayFormatterPass());
        $container->addCompilerPass(new ApplicationRoutePass());
        $container->addCompilerPass(new DashboardPass());
        $container->addCompilerPass(new WidgetPass());
        $container->addCompilerPass(new SearchQueryProviderPass());
        $container->addCompilerPass(new SettingFieldPass());
        $container->addCompilerPass(new AdminRoutePass());
        $container->addCompilerPass(new AddThemePathPass());

        if (php_sapi_name() !== 'cli' and ($container->getParameter('kernel.environment') === 'dev')) {
            $container->addCompilerPass(new WebDebugToolbarPass());
        }
    }
}
