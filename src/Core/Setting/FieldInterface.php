<?php

namespace gita\Core\Setting;

interface FieldInterface
{
    /**
     * Get th form.
     *
     * @return Form
     */
    public function getFormType();
    public function getTemplate();
    public function getName();
}
