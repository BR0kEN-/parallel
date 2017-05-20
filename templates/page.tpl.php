<?php

/**
 * @file
 * page.tpl.php
 *
 * @var string $breadcrumb
 * @var string $messages
 * @var array $page
 * @var array $tabs
 */
?>
<?php print render($tabs); ?>

<?php print $breadcrumb; ?>
<?php print $messages; ?>

<?php print render($page['content']); ?>
