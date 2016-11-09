<?php

namespace gita\Bundle\BlogBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\Response;
use gita\Test\WebTestCase;

class CategoryControllerTest extends WebTestCase
{
    public function testIndexAction()
    {
        $client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', $this->adminPath('blog/category'));
        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
    }

    public function testDataAction()
    {
        $client = $this->getAuthorizedClient();
        $crawler = $client->request('GET', $this->adminPath('blog/category/data/all'));
        $this->assertEquals('application/json', $client->getResponse()->headers->get('Content-Type'));
    }

    public function testEditAction()
    {
        $client = $this->getAuthorizedClient();
        $crawler = $client->request('GET', $this->adminPath('blog/category/edit/new'));
        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
    }
}
