var COLOUR_KEY = '__BASIC_APP_COLOUR__';

                    var colourPages = [],
                        colour      = localStorage[COLOUR_KEY] || 'teal';

                    function setupPageColour(page) {
                        var $topbar = $(page).find('.app-topbar');
                        colourPages.push($topbar);
                        if (colour) {
                            $topbar.addClass(colour);
                        }
                    }


                    App.controller('home', function (page) {
                        setupPageColour(page);

                        $(page).find('[data-target="inputs"]')
                            .attr('data-target', null)
                            .stickyClick(function (unlock) {
                                App.pick('inputs', function (params) {
                                    console.log(JSON.stringify(params));
                                    unlock();
                                });
                            });

                        $(page).find('ul.colour-picker li')
                            .clickable()
                            .on('click', function () {
                                var oldColour = colour;
                                colour = $(this).data('colour');

                                if (oldColour === colour) {
                                    return;
                                }
                                localStorage[COLOUR_KEY] = colour;

                                for (var i=0; i<colourPages.length; i++) {
                                    if (oldColour) {
                                        colourPages[i].removeClass(oldColour);
                                    }
                                    if (colour) {
                                        colourPages[i].addClass(colour);
                                    }
                                }
                            });
                    });

                    App.controller('lists', function (page) {
                        setupPageColour(page);

                        this.onShow = function () {
                            console.log('lists page is visible');
                        };

                        this.onHide = function () {
                            console.log('lists page is invisible');
                        };

                        this.onBack = function () {
                            console.log('lists page is going back');
                        };

                        this.onForward = function () {
                            console.log('lists page is going forward');
                        };
                    });

                    App.controller('buttons', function (page) {
                        setupPageColour(page);

                        $(page).find('.app-menu')
                            .on('click', function () {
                                App.dialog({
                                    doButton     : 'Do Something' ,
                                    otherButton  : 'Or Another Thing'  ,
                                    okButton     : 'Share on Kik' ,
                                    cancelButton : 'Cancel'
                                }, function (choice) {
                                    console.log(choice);
                                });
                            });
                    });

                    App.controller('inputs', function (page) {
                        setupPageColour(page);
                        if (App.platform === 'ios') {
                            this.transition = 'slideon-down';
                        }
                        App.form($(page).find('form'), this.reply);
                    });

                    App.controller('scroll', function (page) {
                        setupPageColour(page);

                        var $loading  = $(page).find('.loading'),
                            $list     = $(page).find('.app-list'),
                            $listItem = $(page).find('.app-list li'),
                            i = 1;

                        $loading.remove();
                        $listItem.remove();

                        App.infiniteScroll($list, { loading: $loading }, function (callback) {
                            if (i >= 40) {
                                return null;
                            }
                            setTimeout(function () {
                                var list = [];
                                for (var j=0; j<12; j++) {
                                    var $node = $listItem.clone();
                                    $node.find('span').text(i+j);
                                    list.push($node);
                                }
                                i += 12;
                                callback(list);
                            }, 1200);
                        });
                    });

                    App.enableDragTransition();

                    try {
                        App.restore();
                    } catch (err) {
                        App.load('buttons');
                    }