<?php

namespace gita\Bundle\CoreBundle\System\Routing;

use gita\Core\Application;
use gita\Core\FrontPageApplicationInterface;

class Search extends Application implements FrontPageApplicationInterface
{
    public function getRoutePrefix()
    {
        return 'search';
    }

    public function getRouteResources()
    {
        return ['xml' => ['@CoreBundle/Resources/config/routing/search.xml']];
    }

    public function  getName() {
        return "Search";
    }

    public function getBasePath() {
        return $this->getRoutePrefix();
    }
}
