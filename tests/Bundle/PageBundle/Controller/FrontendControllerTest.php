<?php

namespace gita\Bundle\PageBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\Response;
use gita\Test\WebTestCase;

class FrontendControllerTest extends WebTestCase
{
    public function testIndexAction()
    {
        $client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', '/non-existing-page');

        $this->assertEquals(Response::HTTP_NOT_FOUND, $client->getResponse()->getStatusCode());
    }
}
