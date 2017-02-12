$.widget("juergs.kanban", {

    options: {
        numOfLanes: 4,
        width: '300px',
        minLaneHeight: '300px',
        itemHeight: '200px'

    },

    _create: function () {
        var _widget = this;
        var $container = $(_widget.element);

        var _numOfLanes = _widget.options.numOfLanes;
        // var _numOfLanes = _widget.options.numOfLanes;

        for (var j = 0; j < _numOfLanes; j++) {
            $(document.createElement('div')).appendTo($container)
                .addClass('swim-lane-container col-sm-3').attr('id', 'swim-lane-container-' + j)

            $(document.createElement('div'))
                .appendTo('#swim-lane-container-' + j)
                .addClass('swim-lane').attr('id', 'swimLane-' + j);
        }

        var _lane0 = $('#swim-lane-container-0').attr('data-lane-name', 'Backlog');
        var _lane1 = $('#swim-lane-container-1').attr('data-lane-name', 'To-Do');
        var _lane2 = $('#swim-lane-container-2').attr('data-lane-name', 'Doing');
        var _lane3 = $('#swim-lane-container-3').attr('data-lane-name', 'Done');

        for (var p = 0; p < _numOfLanes; p++) {
            $(document.createElement('h3')).prependTo('#swim-lane-container-' + p)
                .html($('#swim-lane-container-' + p).data('lane-name'));
        }

        $(".swim-lane").sortable({
            connectWith: ".swim-lane"
        })

        _widget._createHelpers();
    },

    /*
     * Create a new task on the backlog swimlane of the Kanban chart
     */
    createNewTask: function () {
        var _widget = this;
        var $container = $(_widget.element);

        $('#createModal').modal('show');

        var _swimLane0 = $container.find('#swimLane-0');
        var _createNew = $('#createModal #cmdCreateNew');
        var _modalBody = $('#createModal .modal-body');

        //Create new task on click
        _createNew.click(function () {
            var _title = _modalBody.find('#task-title');
            var _desc = _modalBody.find('#task-description');

            if (_title.val().length > 0 && _desc.val().length > 0) {
                var _task = $(document.createElement('div')).appendTo(_swimLane0).addClass('task');

                $(document.createElement('span')).appendTo(_task).addClass('delete')
                    .html('<button type="button" class="close"><span aria-hidden="true">&times;</span></button>').hide();

                var _taskTitle = $(document.createElement('div')).appendTo(_task).addClass('task-title')
                    .html('<h3 class="title">' + _title.val() + '</h3>');

                $(document.createElement('input')).appendTo(_taskTitle).addClass('edit-title form-control').hide();

                var _taskDesc = $(document.createElement('div')).appendTo(_task).addClass('task-description')
                    .html('<p class="desc">' + _desc.val() + '</p>');

                $(document.createElement('input')).appendTo(_taskDesc).addClass('edit-desc form-control').hide();

                $(document.createElement('button')).appendTo(_task).addClass(' btn btn-link btn-block edit').html('Edit').hide();

                var save_cancel = $(document.createElement('div')).appendTo(_task).addClass('row save-cancel').hide();
                var _cancel = $(document.createElement('div')).appendTo(save_cancel).addClass('col-sm-6 cancel-edit');
                var _save = $(document.createElement('div')).appendTo(save_cancel).addClass('col-sm-6 save-edit');

                $(document.createElement('button')).appendTo(_cancel).addClass(' btn btn-warning btn-block cancel').html('Cancel');

                $(document.createElement('button')).appendTo(_save).addClass(' btn btn-success btn-block save').html('Save');

                $('#createModal').modal('hide');

                _title.val('');
                _desc.val('');

                _title.removeClass('warning');
                _desc.removeClass('warning');

            } else {
                if (_title.val().length === 0) {
                    _title.addClass('warning');
                }

                if (_desc.val().length === 0) {
                    _desc.addClass('warning');
                }
            }
        })

    },

    editTask: function () {
        $('.task .edit').show();

        $('.task .edit').click(function () {
            var _task = $(this).parent('.task');

            var _edit = _task.find('.edit').hide();

            //Show textboxes with old values set
            var _title = _task.find('.edit-title').show();
            var _desc = _task.find('.edit-desc').show();

            //Hide text
            var _originalTitle = _task.find('.task-title .title').hide();
            var _originalDesc = _task.find('.task-description .desc').hide();

            _title.val(_originalTitle.text());
            _desc.val(_originalDesc.text());

            //Show commands
            var _save_cancel = _task.find('.save-cancel').show();
            var _cancel = _task.find('.save-cancel .cancel-edit .cancel');
            var _save = _task.find('.save-cancel .save-edit .save');

            _cancel.click(function () {
                _title.val('').hide();
                _desc.val('').hide();

                _originalTitle.show();
                _originalDesc.show();

                _save_cancel.hide();
                _edit.show();
            });

            _save.click(function () {

                if (_title.val().length > 0 && _desc.val().length > 0) {
                    _originalTitle.text(_title.val());
                    _originalDesc.text(_desc.val());

                    _title.removeClass('warning');
                    _desc.removeClass('warning');

                    _title.hide();
                    _desc.hide();

                    _originalTitle.show();
                    _originalDesc.show();

                    _save_cancel.hide();
                    _edit.show();

                } else {
                    if (_title.val().length === 0) {
                        _title.addClass('warning');
                    }

                    if (_desc.val().length === 0) {
                        _desc.addClass('warning');
                    }
                }
            });

        });
    },

    /*
     * Remove a task individually
     */
    removeTask: function () {
        $('.task .delete').show();

        $('.task .delete').click(function () {
            $(this).parent('.task').remove();
        });
    },

    /*
     * Remove all tasks
     */
    removeAll: function () {
        $('.task').remove();
    },

    _createHelpers: function () {
        var _widget = this;
        var $container = $(_widget.element);

        //create add task modal
        var _modalContainer = $(document.createElement('div'))
            .addClass('modal fade').attr('id', 'createModal')
            .attr('role', 'dialog').attr('tabindex', '-1')
            .appendTo(".kanban-container");

        var _modalDialog = $(document.createElement('div')).addClass('modal-dialog').attr('role', 'document').appendTo(_modalContainer);

        var _modalContent = $(document.createElement('div')).addClass('modal-content').appendTo(_modalDialog);

        //this is dirty.. not a fan of this right now :/
        $(document.createElement('div')).addClass('modal-header').appendTo(_modalContent);
        $('#createModal .modal-header').html('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">Create New Task</h4>');

        $(document.createElement('div')).addClass('modal-body').appendTo(_modalContent);
        $('#createModal .modal-body').html('<form><div class="form-group"><label for="task-title" class="control-label">Title:</label><input type="text" class="form-control" id="task-title"></div><div class="form-group"><label for="task-description" class="control-label">Description:</label><input type="text" class="form-control" id="task-description"></div></form>');

        $(document.createElement('div')).addClass('modal-footer').appendTo(_modalContent);
        $('#createModal .modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" id="cmdCreateNew" class="btn btn-primary">Save changes</button>');

        $('#createModal').modal({
            show: false,
        });
    }
});