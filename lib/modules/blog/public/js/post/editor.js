'use strict';

(function ($, tagOptions, tags, CKEDITOR) {

    var dirty = false;

    drafTerbit.blogPostEditor = {

        titleSelector: 'input[name="post[title]"]',
        slugSelector: 'input[name="post[slug]"]',

        syncSlugAndTitle: function syncSlugAndTitle() {
            $(this.titleSelector).on('keyup', this.syncSlugTitle);
        },

        desyncSlugAndTitle: function desyncSlugAndTitle() {
            $(this.titleSelector).off('keyup', this.syncSlugTitle);
        },

        syncSlugTitle: function syncSlugTitle(e) {
            var val = $(drafTerbit.blogPostEditor.titleSelector).val().toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
            $(drafTerbit.blogPostEditor.slugSelector).val(val);
        }
    };

    var form = $('#post-edit-form'),
        spinner = $('i.spinner'),
        id = $('input[name="post[id]"]'),
        closeText = $('.dt-editor-close-text');

    //magisuggest-ify tags
    var tagsInput = $('#tags').magicSuggest({
        name: 'tags',
        cls: 'tags-input',
        placeholder: 'add tags here',
        hideTrigger: true,
        toggleOnClick: true,
        maxSuggestions: 5,
        data: tagOptions,
        value: tags,
        highlight: false
    });

    // change dropdown default width and position
    // of magicsuggest
    $(tagsInput).on('expand', function (c) {

        var pos = $('.ms-sel-ctn').find('input').position();
        var h = $('.ms-sel-ctn').find('input').height();

        var ctn = $('.ms-res-ctn');

        if (ctn.children().length < 1) {
            ctn.css({ display: 'none' });
        } else {
            ctn.css({
                width: "auto",
                position: "absolute",
                top: pos.top + h + "px",
                left: pos.left + "px"
            });
        }
    });

    // remove error message
    $(':input').on('focus', function () {
        $(this).siblings('.error-msg').remove();
        $(this).closest('.form-group').removeClass('has-error');
    });

    form.ajaxForm({

        dataType: 'json',
        beforeSerialize: function beforeSerialize() {
            // fixes ckeditor content
            for (var instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].updateElement();
            }
        },

        beforeSend: function beforeSend() {
            spinner.removeClass('fa-check');
            spinner.addClass('fa-spin fa-spinner');
        },

        /**
         * @todo make this usable
         */
        error: function error(xhr) {
            var data = xhr.responseJSON;
            if (data.errors) {
                if (data.errorType == 'validation') {
                    for (var i in data.errors) {

                        var inputCtn = $(':input[name="' + data.errors[i].param + '"]').closest('.form-group');
                        inputCtn.addClass('has-error');

                        if (!inputCtn.children('.error-msg').length) {
                            inputCtn.append('<span class="help-block error-msg">' + data.errors[i].msg + '</span>');
                        }
                    }
                }
            }
        },

        success: function success(data) {

            dirty = false;
            spinner.removeClass('fa-spin fa-spinner');
            spinner.addClass('fa-check');

            if (data.id) {
                id.val(data.id);

                $.notify(data.message, data.status);
                drafTerbit.blogPostEditor.desyncSlugAndTitle();
                closeText.text(__('Close'));
            }
        }
    });

    // check form before leaving page
    window.onbeforeunload = function () {

        form.on('change', ':input', function () {
            dirty = true;
        });

        for (var instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].on('change', function () {
                dirty = true;
            });
        }

        return function (e) {
            if (dirty) {
                return __('Discard unsaved changes ?');
            }
        };
    }();

    //clear history
    $('a.clear-history').on('click', function (e) {
        e.preventDefault();

        if (confirm(__('This will delete post revision history and can not be undone, are you sure ?'))) {
            var id = $(this).data('post-id');
            $.ajax({
                type: 'post',
                data: { id: id },
                url: drafTerbit.adminUrl + 'blog/revision/clear',
                success: function success() {
                    // @todo js translation
                    $.notify(__('Revisions cleared'), 'success');
                    $('.revisions-container').fadeOut('fast');
                }
            });
        }
    });

    $(".publish-date").datetimepicker({
        format: 'yyyy-mm-dd hh:ii',
        autoclose: true
    });
})(jQuery, tagOptions, tags, CKEDITOR);