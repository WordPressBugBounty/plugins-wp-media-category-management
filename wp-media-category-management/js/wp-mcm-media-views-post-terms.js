window.wp = window.wp || {};
(function() {
	var MCMMediaLibraryTaxonomyFilter = wp.media.view.AttachmentFilters.extend({
	id: 'mcm-media-attachment-taxonomy-filter',

		createFilters: function() {
			var filters = {};
			var that = this;

			// Formats the 'mcm_terms_list' we've included via wp_localize_script()
			_.each(wpmcm_admin_js_terms.mcm_terms_list || {}, function(value, index) {
				var count = (typeof value.count !== 'undefined') ? value.count : 0;
				filters[index] = {
				  text: value.name + ' (' + count + ')',
				};
				filters[index]['props'] = {};
				filters[index]['props'][wpmcm_admin_js_terms.mcm_terms_key] = value.term_id;
			});

			// Add the option to select ALL
			filters.all = {
				text: wpmcm_admin_js_terms.mcm_terms_label_all,
				priority: 10
			};
			filters['all']['props'] = {};
			filters['all']['props'][wpmcm_admin_js_terms.mcm_terms_key] = '';

			// Add the option to select No category
			filters.no_category = {
				text: wpmcm_admin_js_terms.mcm_terms_label_none,
				priority: 10
			};
			filters['no_category']['props'] = {};
			filters['no_category']['props'][wpmcm_admin_js_terms.mcm_terms_key] = wpmcm_admin_js_terms.mcm_no_cat_key || 'no_category';

			this.filters = filters;
		}
	});

	var MCMMediaLibraryFolderFilter = wp.media.view.AttachmentFilters.extend({
		id: 'mcm-media-attachment-folder-filter',

		createFilters: function() {
			var filters = {};

			_.each(wpmcm_admin_js_terms.mcm_folder_list || [], function(folder_name, index) {
				var counts = wpmcm_admin_js_terms.mcm_folder_counts || {};
				var count = (typeof counts[folder_name] !== 'undefined') ? counts[folder_name] : 0;
				filters['folder_' + index] = {
					text: folder_name + ' (' + count + ')',
					props: {
						wp_mcm_folder: folder_name,
					}
				};
			});

			filters.all = {
				text: wpmcm_admin_js_terms.mcm_folder_label_all,
				priority: 10,
				props: {
					wp_mcm_folder: ''
				}
			};

			var no_folder_count = 0;
			if (wpmcm_admin_js_terms.mcm_folder_counts && typeof wpmcm_admin_js_terms.mcm_no_folder_key !== 'undefined') {
				no_folder_count = wpmcm_admin_js_terms.mcm_folder_counts[wpmcm_admin_js_terms.mcm_no_folder_key] || 0;
			}
			filters.no_folder = {
				text: wpmcm_admin_js_terms.mcm_folder_label_none + ' (' + no_folder_count + ')',
				priority: 10,
				props: {
					wp_mcm_folder: wpmcm_admin_js_terms.mcm_no_folder_key || 'no_folder'
				}
			};

			this.filters = filters;
		}
	});

	/**
	  * Extend and override wp.media.view.AttachmentsBrowser to include our new filter
	  */
	var AttachmentsBrowser = wp.media.view.AttachmentsBrowser;
	wp.media.view.AttachmentsBrowser = wp.media.view.AttachmentsBrowser.extend({
		createToolbar: function() {
			var that = this;
			i = 1;

			// Make sure to load the original toolbar
			AttachmentsBrowser.prototype.createToolbar.call(this);

			// Get the labels and items for each mcm_taxonomies
			that.toolbar.set( 'MCMMediaLibraryTaxonomyFilter', new MCMMediaLibraryTaxonomyFilter({
				controller: that.controller,
				model: that.collection.props,
				priority: -80 + 10*i++,
			}).render() );

			if (Array.isArray(wpmcm_admin_js_terms.mcm_folder_list) && wpmcm_admin_js_terms.mcm_folder_list.length) {
				that.toolbar.set( 'MCMMediaLibraryFolderFilter', new MCMMediaLibraryFolderFilter({
					controller: that.controller,
					model: that.collection.props,
					priority: -80 + 10*i++,
				}).render() );
			}
		}
	});

	jQuery(function($) {
		$(document).on('change', 'select[name$="[wp_mcm_folder_move]"]', function() {
			var $select = $(this);
			var currentFolder = $select.data('current-folder');
			var selectedFolder = $select.val();

			if (typeof currentFolder === 'undefined' || currentFolder === selectedFolder) {
				return;
			}

			var confirmText = (typeof wpmcm_admin_js_terms !== 'undefined' && wpmcm_admin_js_terms.mcm_folder_move_confirm_text) ? wpmcm_admin_js_terms.mcm_folder_move_confirm_text : 'Change the folder for this media item? The file will be moved when saved.';
			if (! window.confirm(confirmText)) {
				$select.val(currentFolder);
			} else {
				$select.data('current-folder', selectedFolder);
			}
		});
	});

})( jQuery );