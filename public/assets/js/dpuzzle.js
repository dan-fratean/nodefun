/*
    dPuzzle - a slide puzzle generator using jQuery
    Copyright (C)2013 Dan Fratean
    All rights reserved
*/
var dPuzzle = function() {
	return {
		img_object: 0,
		width: 0,
		height: 0,
		x_blocks: 0,
		y_blocks: 0,
		src: '',
		resize: 620,
		empty_spot_id: 0,
		block_size_x: 0,
		block_size_y: 0,
		board: 0,
		drag_start:0,
		init: function (img) {
			img_object = img;
			src = img.attr('src');
			if (img.attr('resize')) resize = img.attr('resize')
			resize = resize / img.width();
			width = img.width() * resize;
			height = img.height() * resize;
			x_blocks = img.attr('x_blocks');
			y_blocks = img.attr('y_blocks');
			empty_spot_id = x_blocks * y_blocks;
			block_size_x = Math.round(height/x_blocks);
			block_size_y = Math.round(width/y_blocks);
			width = block_size_y * y_blocks;
			height = block_size_x * x_blocks;
		},
		initBoard: function(dpuzzle) {
			img_object.parent().addClass('dpuzzle-no-select');
			img_object.parent().css({
				'width': width+'px',
				'height': height+'px'
			});

			img_object.css({
				'top': '0px',
				'left': '0px',
				'width': width+'px',
				'height': height+'px',
				'display': 'inline',
				'opacity': '0.1'
			});

			var k=0;
			board = Array(x_blocks);
			for (var i=0; i<x_blocks; i++) {
				board[i] = Array(y_blocks);
				for (var j=0; j<y_blocks; j++) {
					k++;
					var div_name = 'block-'+i+'-'+j;
					var div = $('<div id="'+div_name+'" class="dpuzzle-block-common"></div>');
					var drag_area = $('<div id="drag-area-'+div_name+'" class="dpuzzle-drag-area"></div>');

					div.attr('block-id',k);

					var ypos = -1 * i * block_size_x -1;
					var xpos = -1 * j * block_size_y -1;
					var bpos = xpos+'px '+ypos+'px';

					if (k != empty_spot_id) {
						div.css({
							'background-image': 'url("'+src+'")',
							'background-position': bpos,
							'background-size': width+'px '+height+'px'
						});
						div.addClass('dpuzzle-block');
						div.draggable({
							containment: '#drag-area-'+div_name,
							scroll: false,
							revert: 'invalid',
							revertDuration: 30,
							start: function(event, ui) {
								ui.helper.data('draggable_object', $(this));
								dpuzzle.drag_start = 1;
							},
							stop: function(event, ui) {
								if (dpuzzle.drag_start == 1)
								{
									dpuzzle.resetDraggableArea();
								}
							}
						});
						div.html('<span class="dpuzzle-block-numbers">'+k+'</span>');
					} else {
						div.addClass('dpuzzle-empty-block');
						div.droppable({
							accept: '.dpuzzle-block',
							drop: function (event, ui) {
								dpuzzle.drag_start = 2;
								ui.draggable.data('droppable_object', $(this));
								setTimeout(function () {
									ui.draggable.data('draggable_object').draggable('enable');
									dpuzzle.switchBlocks(ui.draggable.data('draggable_object'), ui.draggable.data('droppable_object'));
									if (dpuzzle.puzzleSolved()) {
										dpuzzle.showGrats();
									}
									dpuzzle.resetDraggableArea();
								}, 20);
							}
						})
					};
					div.css({
						'width': (block_size_y-2)+'px',
						'height': (block_size_x-2)+'px',
						'top': i*block_size_x,
						'left': j*block_size_y
					});
					drag_area.css({
						'width': (block_size_y)+'px',
						'height': (block_size_x)+'px',
						'top': i*block_size_x,
						'left': j*block_size_y

					});

					board[i][j] = Array(2);
					board[i][j][0] = div;
					board[i][j][1] = drag_area;
				}
			}
		},
		switchBlocks: function(a, b) {
			var c = board[a.attr('x')][a.attr('y')];
			board[a.attr('x')][a.attr('y')] = board[b.attr('x')][b.attr('y')];
			board[b.attr('x')][b.attr('y')] = c;

			$.each( board, function( i, row ) {
				$.each( row, function( j, block ) {
					if(i != block[0].attr('x'))
					{
						block[0].attr('x', i);
						block[0].css({'top': i*block_size_x});
						block[1].css({'top': i*block_size_x});
					}
					if(j != block[0].attr('y'))
					{
						block[0].attr('y', j);
						block[0].css({'left': j*block_size_y});
						block[1].css({'left': j*block_size_y});
					}
				})
			})
		},
		puzzleSolved: function() {
			solved = true;
			block_id = 0;
			for (var i=0; i<x_blocks; i++) {
				for (var j=0; j<y_blocks; j++) {
					if (solved && block_id < parseInt(board[i][j][0].attr('block-id'))) {
						block_id = board[i][j][0].attr('block-id');
					} else {
						solved = false;
					}
				}
			}
			return solved;
		},
		resetDraggableArea: function() {
			$.each( board, function( i, row ) {
				$.each( row, function( j, block ) {
					block[0].css({
						'top': i*block_size_x,
						'left': j*block_size_y,
						'cursor': 'auto'
					});
					block[1].css({
						'width': (block_size_y)+'px',
						'height': (block_size_x)+'px',
						'top': i*block_size_x,
						'left': j*block_size_y
					});
				})
			})
			$.each( board, function( i, row ) {
				$.each( row, function( j, block ) {
					if (block[0].attr('block-id') == empty_spot_id) {
						if (i > 0) {
							board[i-1][j][1].css({
								'height': block_size_x*2
							});
							board[i-1][j][0].css({
								'cursor': 'move'
							});
						}
						if (i < x_blocks - 1) {
							board[i+1][j][1].css({
								'height': block_size_x*2,
								'top': i*block_size_x
							});
							board[i+1][j][0].css({
								'cursor': 'move'
							});
						}
						if (j > 0) {
							board[i][j-1][1].css({
								'width': block_size_y*2
							});
							board[i][j-1][0].css({
								'cursor': 'move'
							});
						}
						if (j < y_blocks - 1) {
							board[i][j+1][1].css({
								'width': block_size_y*2,
								'left': j*block_size_y
							});
							board[i][j+1][0].css({
								'cursor': 'move'
							});
						}
					}
				})
			})
		},
		showGrats: function() {
			alert($("<div/>").html(img_object.attr('message')).text());
		},
		shuffleBoard: function() {
			empty_spot_x = x_blocks-1;
			empty_spot_y = y_blocks-1;
			for (var i=0; i<(x_blocks*y_blocks*x_blocks*y_blocks); i++) {
				var r = Math.floor(Math.random()*4);
				switch(r) {
					case 0:
						if (empty_spot_x > 0) {
							c = board[empty_spot_x][empty_spot_y];
							board[empty_spot_x][empty_spot_y] = board[empty_spot_x-1][empty_spot_y];
							board[empty_spot_x-1][empty_spot_y] = c;
							empty_spot_x--;
						}
						break;
					case 1:
						if (empty_spot_x < x_blocks-1) {
							c = board[empty_spot_x][empty_spot_y];
							board[empty_spot_x][empty_spot_y] = board[empty_spot_x+1][empty_spot_y];
							board[empty_spot_x+1][empty_spot_y] = c;
							empty_spot_x++;
						}
						break;
					case 2:
						if (empty_spot_y > 0) {
							c = board[empty_spot_x][empty_spot_y];
							board[empty_spot_x][empty_spot_y] = board[empty_spot_x][empty_spot_y-1];
							board[empty_spot_x][empty_spot_y-1] = c;
							empty_spot_y--;
						}
						break;
					case 3:
						if (empty_spot_y < y_blocks-1) {
							c = board[empty_spot_x][empty_spot_y];
							board[empty_spot_x][empty_spot_y] = board[empty_spot_x][empty_spot_y+1];
							board[empty_spot_x][empty_spot_y+1] = c;
							empty_spot_y++;
						}
						break;
				}
			}
		},
		showBoard: function() {
			$.each( board, function( i, row ) {
				$.each( row, function( j, block ) {
					block[0].css({'position': 'absolute'});
					block[0].attr('x', i);
					block[0].attr('y', j);
					img_object.parent().append( block[0]);
					img_object.parent().append( block[1]);
				})
			})
			this.resetDraggableArea();
		},
		logVariables: function() {
			var track_keys = ['width', 'height', 'x_blocks', 'y_blocks', 'src', 'resize', 'empty_spot_id', 'block_size_x', 'block_size_y']
			for (var i=0, n=track_keys.length; i<n; i++) {
				console.log(i+1 + ' - ' + track_keys[i] + ': ' +eval(track_keys[i]));
			}
		},
		logBoard: function() {
			var str='';
			for (var j=0; j<y_blocks; j++) {
				for (var i=0; i<x_blocks; i++) {
					b = board[i][j][0].attr('block-id');
					if (board[i][j][0].attr('block-id') < 10)
						b = ' ' + b;
					if (board[i][j][0].attr('block-id') < 100)
						b = ' ' + b;
					str = str + '[' + b + '(' + board[i][j][0].attr('x') + '/' + board[i][j][0].attr('y') + ')/(' + i + '/'+j+')]';
				}
				if (j<y_blocks-1)
					str = str + '\n';
			}
			console.log(str);
		},
		startPuzzle: function(image, dpuzzle) {
			dpuzzle.init(image);
			dpuzzle.initBoard(dpuzzle);
			dpuzzle.shuffleBoard();
			dpuzzle.showBoard();
		},
	}
};
