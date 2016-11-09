<?php

namespace gita\Bundle\BlogBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\Response;
use gita\Test\WebTestCase;

class PostControllerTest extends WebTestCase
{
    public function testIndexAction()
    {
        $client = $this->getAuthorizedClient();

        $crawler = $client->request('GET', $this->adminPath('blog/post'));

        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
        $this->assertContains('Post', $client->getResponse()->getContent());
    }

    public function testDataAction()
    {
        $client = $this->getAuthorizedClient();
        $crawler = $client->request('GET', $this->adminPath('blog/post/data'));
        $this->assertEquals('application/json', $client->getResponse()->headers->get('Content-Type'));
    }

    public function testEditAction()
    {
        $client = $this->getAuthorizedClient();
        $crawler = $client->request('GET', $this->adminPath('blog/post/edit/new'));
        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
    }

    public function testFeedAction()
    {
        $client = static::createClient();
        $crawler = $client->request('GET', 'blog/feed.xml');
        $this->assertEquals(Response::HTTP_OK, $client->getResponse()->getStatusCode() );
        $this->assertEquals('application/xml', $client->getResponse()->headers->get('Content-Type'));
    }
}
