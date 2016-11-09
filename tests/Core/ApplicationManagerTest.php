<?php

namespace gita\Core\Tests;
use gita\Core\ApplicationManager;
use gita\Core\Application;

class ApplicationManagerTest extends \PHPUnit_Framework_testCase
{

    function testHasPrefix()
    {
        $am = new ApplicationManager;
        $this->assertCount(0, $am->getRoutes());

        $am->register(new DummyApplication());

        $this->assertTrue($am->hasPrefix("dummy"));
        $this->assertCount(1, $am->getRoutes());
    }
}

class DummyApplication extends Application
{
    public function getRoutePrefix() {
        return "dummy";
    }
}