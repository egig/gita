<?php

namespace gita\Bundle\UserBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use gita\Bundle\UserBundle\Entity\Group;

class LoadGroupData extends AbstractFixture implements OrderedFixtureInterface
{
    /**
     * {@inheritdoc}
     */
    public function load(ObjectManager $manager)
    {
        $groupAdmin = new Group('Administrator');
        $groupAdmin->addRole('ROLE_SUPER_ADMIN');

        $manager->persist($groupAdmin);
        $manager->flush();

        $this->addReference('admin-group', $groupAdmin);
    }

    /**
     * {@inheritdoc}
     */
    public function getOrder()
    {
        return 1;
    }
}
