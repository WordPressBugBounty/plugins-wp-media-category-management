<?php

/**
 * WP Media Category Management WP_MCM_Walker_Category_MediaGrid_Checklist class for wp_checklist_categories, based on https://gist.github.com/stephenh1988/2902509
 * 
 * @since  2.0.0
 * @author DeBAAT
 */

if (!defined('ABSPATH')) exit;

if (!class_exists('WP_MCM_Walker_Category_MediaGrid_Checklist')) {

	class WP_MCM_Walker_Category_MediaGrid_Checklist extends Walker
	{
		var $tree_type = 'category';
		var $db_fields = array('parent' => 'parent', 'id' => 'term_id');

		function start_lvl(&$output, $depth = 0, $args = array())
		{
			$indent = str_repeat("\t", $depth);
			$output .= "$indent<ul class='children'>\n";
		}

		function end_lvl(&$output, $depth = 0, $args = array())
		{
			$indent = str_repeat("\t", $depth);
			$output .= "$indent</ul>\n";
		}

		function start_el(&$output, $category, $depth = 0, $args = array(), $id = 0)
		{
			extract($args);

			if (empty($taxonomy)) {
				$taxonomy = 'category';
			}

			$name = 'tax_input[' . $taxonomy . ']';

			$li_element_id       = $taxonomy . '-' . $category->term_id;
			$checkbox_element_id = 'in-' . $taxonomy . '-' . $category->term_id;

			$output .= "\n<li id='" . esc_attr($li_element_id) . "'>";
			$output .= '<label class="selectit">';
			$output .= '<input value="' . $category->term_id . '" ';
			$output .= 'type="checkbox" ';
			$output .= 'name="' . $name . '[]" ';
			$output .= 'id="' . esc_attr($checkbox_element_id) . '"';
			$output .= checked(in_array($category->term_id, $selected_cats), true, false);
			$output .= disabled(empty($args['disabled']), false, false);
			$output .= ' /> ';
			$output .= esc_html(apply_filters('the_category', $category->name));
			$output .= '</label>';
			// WP_MCM_debugMP('pr', ' WP_MCM_Walker_Category_MediaGrid_Checklist category = ', $category, NULL, NULL, true);
			// WP_MCM_debugMP('pr', ' WP_MCM_Walker_Category_MediaGrid_Checklist output = ', esc_html($output), NULL, NULL, true);
		}

		function end_el(&$output, $category, $depth = 0, $args = array())
		{
			$output .= "</li>\n";
		}
	}
}
