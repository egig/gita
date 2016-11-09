<?php

namespace gita\Core\Log;

interface EntityFormatterInterface
{
    public function getName();

    public function format($id);
}
