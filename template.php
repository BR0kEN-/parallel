<?php

/**
 * @file
 * Theme functions and callbacks.
 */

// Relative path to theme.
define('PARALLEL_THEME_PATH', $GLOBALS['theme_path']);

/**
 * Implements hook_html_head_alter().
 */
function parallel_html_head_alter(array &$head_elements) {
  $head_elements['system_meta_content_type']['#attributes'] = [
    'charset' => 'utf-8',
  ];

  unset($head_elements['system_meta_generator']);
}

/**
 * Implements hook_css_alter().
 */
function parallel_css_alter(array &$css) {
  $css = array_diff_key($css, [
    'modules/system/system.menus.css' => FALSE,
  ]);
}

/**
 * Implements hook_page_alter().
 */
function parallel_page_alter(array &$page) {
  $page['page_top']['parallel']['#attached']['js'][] = [
    'type' => 'external',
    'data' => '//html5shiv.googlecode.com/svn/trunk/html5.js',
  ];
}

/**
 * Implements template_preprocess_views_view().
 */
function parallel_preprocess_views_view(array &$variables) {
  /* @var \view $variables['view'] */
  $variables['title'] = $variables['view']->get_title();
}
