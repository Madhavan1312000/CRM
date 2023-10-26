(function ($) {
    /* Initialize function */
    $.fn.tablemanager = function (options = null) {
        /**
        Get common variables, parts of tables and others utilities
        **/
        var Table   = $(this),
            Heads   = $(this).find("thead th"),
            tbody   = $(this).find("tbody"),
            rows    = $(this).find("tbody tr"),
            rlen    = rows.length,
            arr     = [],
            cells,
            clen;

        /**
        Options default values
        **/
        var firstSort       = [[0, 0]],
            dateColumn      = [],
            dateFormat      = [],
            disableFilterBy = [];

        /**
        Debug value true or false
        **/
        var debug = false;
        var debug = options !== null && options.debug == true ? true : false;

        /**
        Set pagination true or false
        **/
        var pagination = false;
        pagination =
            options !== null && options.pagination == true ? true : false;
        // default pagination variables
        var currentPage = 0;
        var numPerPage =
            pagination !== true && showrows_option !== true ? rows.length : 5;
        var numOfPages = options.numOfPages !== undefined && options.numOfPages > 0 ? options.numOfPages : 5;

        /**
        Set default show rows list or set if option is set
        **/
        var showrows = [5, 10, 50];
        showrows =
            options !== null &&
            options.showrows != "" &&
            typeof options.showrows !== undefined &&
            options.showrows !== undefined
                ? options.showrows
                : showrows;

        /**
        Default labels translations
        **/
        var voc_filter_by = "Filter by",
            voc_type_here_filter = "Type here to filter...",
            voc_show_rows = "Show rows";

        /**
        Available options:
        **/
        var availableOptions = new Array();
        availableOptions = [
            "debug",
            "firstSort",
            "disable",
            "appendFilterby",
            "dateFormat",
            "pagination",
            "showrows",
            "vocabulary",
            "disableFilterBy",
            "numOfPages"
        ];

        // debug
        // make array form options object
        arrayOptions = $.map(options, function (value, index) {
            return [index];
        });
        for (i = 0; i < arrayOptions.length; i++) {
            // check if options are in available options array
            if (availableOptions.indexOf(arrayOptions[i]) === -1) {
                if (debug) {
                    cLog(
                        "Error! " + arrayOptions[i] + " is unavailable option."
                    );
                }
            }
        }

        /**
        Get options if set
        **/
        if (options !== null) {
            /**
            Check options vocabulary
            **/
            if (
                options.vocabulary != "" &&
                typeof options.vocabulary !== undefined &&
                options.vocabulary !== undefined
            ) {
                // Check every single label

                voc_filter_by =
                    options.vocabulary.voc_filter_by != "" &&
                    options.vocabulary.voc_filter_by !== undefined
                        ? options.vocabulary.voc_filter_by
                        : voc_filter_by;

                voc_type_here_filter =
                    options.vocabulary.voc_type_here_filter != "" &&
                    options.vocabulary.voc_type_here_filter !== undefined
                        ? options.vocabulary.voc_type_here_filter
                        : voc_type_here_filter;

                voc_show_rows =
                    options.vocabulary.voc_show_rows != "" &&
                    options.vocabulary.voc_show_rows !== undefined
                        ? options.vocabulary.voc_show_rows
                        : voc_show_rows;
            }

            var showrows_option = false;
            if (
                options.showrows != "" &&
                typeof options.showrows !== undefined &&
                options.showrows !== undefined
            ) {
                showrows_option = true;

                // div num rows
                var numrowsDiv =
                    '<div id="for_numrows" class="for_numrows" style="display: inline;"><label for="numrows">' +
                    translate(voc_show_rows) +
                    ': </label><select id="numrows"></select></div>';
                // append div to choose num rows to show
                Table.before(numrowsDiv);
                // get show rows options and append select to its div
                for (i = 0; i < showrows.length; i++) {
                    $("select#numrows").append(
                        $("<option>", {
                            value: showrows[i],
                            text: showrows[i],
                        })
                    );

                    // debug
                    if (isNaN(showrows[i])) {
                        if (debug) {
                            cLog(
                                'Error! One of your "show rows" options is not a number.'
                            );
                        }
                    }
                }
            }
 /**
            Pagination
            **/
            if (pagination === true || Table.hasClass("tablePagination")) {
                var numPages = Math.ceil(rows.length / numPerPage);

                // append num pages on bottom
                var pagesDiv =
                    '<div id="pagesControllers" class="pagesControllers"></div>';
                Table.after(pagesDiv);

                // Showrows option and append
                // If showrows is set get select val
                if (showrows_option !== true) {
                    var selectNumRowsVal = numPerPage;
                }

                generatePaginationValues();
            }
/**
            Append filter option
            **/
            if (
                options.appendFilterby === true ||
                Table.hasClass("tableFilterBy")
            ) {
                // Create div and select to filter
                var filterbyDiv =
                    '<div id="for_filter_by" class="for_filter_by" style="display: inline;"><label for="filter_by" id="filter_label">' +
                    translate(voc_filter_by) +
                    ' </label><select id="filter_by"></select> <input id="filter_input" type="text"></div>';
                $(this).before(filterbyDiv);

                // Populate select with every th text and as value use column number
                $(Heads).each(function (i) {
                    if (!$(this).hasClass("disableFilterBy")) {
                        $("select#filter_by").append(
                            $("<option>", {
                                value: i,
                                text: $(this).text(),
                            })
                        );
                    }
                });

                // Filter on typing selecting column by select #filter_by
                $("input#filter_input").on("keyup", function () {
                    var val = $.trim($(this).val())
                        .replace(/ +/g, " ")
                        .toLowerCase();
                    var select_by = $("select#filter_by").val();

                    Table.find("tbody tr")
                        .show()
                        .filter(function () {
                            // search into column selected by #filter_by
                            var text = $(this)
                                .find("td:eq(" + select_by + ")")
                                .text()
                                .replace(/\s+/g, " ")
                                .toLowerCase();
                            return !~text.indexOf(val);
                        })
                        .hide();
                        
                    if(val == '') paginate();
                });
            }
 /**
            Check if first element to sort is empty or undefined
            **/
            if (
                options.firstSort != "" &&
                typeof options.firstSort !== undefined &&
                options.firstSort !== undefined
            ) {
                var firstSortColumn = [];
                var firstSortRules = options.firstSort;
                var firstSortOrder = [];
                for (i = 0; i < options.firstSort.length; i++) {
                    firstSortColumn.push(options.firstSort[i][0]);
                    firstSortOrder.push(options.firstSort[i][1]);
                }
                TableSort(firstSortRules);
            }
        }
        if (debug) {
            cLog("Options set:", options);
        }
 /**
        Append sorted table
        arr = array with table html
        **/
        function appendSortedTable(arr) {
            // create rows and cells by sorted array
            // for(i = 0; i < rlen; i++){
            //     arr[i] = "<td>"+arr[i].join("</td><td>")+"</td>";
            // };
            // reset tbody
            tbody.html("");
            // append new sorted rows
            tbody.html("<tr>" + arr.join("</tr><tr>") + "</tr>");
            // then launch paginate function (if options.paginate = false it will not do anything)
            paginate();
        }

        /**
        Format date
        dateFormat = the date format passed by user
        date = date to format
        **/
        function formatDate(dateFormat, date) {
            var $date = date;
            // debug variable
            var format = 0;
            if (dateFormat == "ddmmyyyy") {
                $date = date.replace(
                    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
                    "$3$2$1"
                );
                format = 1;
            }
            if (dateFormat == "mmddyyyy") {
                $date = date.replace(
                    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
                    "$3$1$2"
                );
                format = 1;
            }
            if (dateFormat == "dd-mm-yyyy") {
                $date = date.replace(
                    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
                    "$3-$2-$1"
                );
                format = 1;
            }
            if (dateFormat == "mm-dd-yyyy") {
                $date = date.replace(
                    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
                    "$3-$1-$2"
                );
                format = 1;
            }
            if (dateFormat == "dd/mm/yyyy") {
                $date = date.replace(
                    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
                    "$3/$2/$1"
                );
                format = 1;
            }
            if (dateFormat == "mm/dd/yyyy") {
                $date = date.replace(
                    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
                    "$3/$1/$2"
                );
                format = 1;
            }
            // For debugging
            if (format == 0) {
                if (debug) {
                    cLog('Error! Unvalid "date format".');
                }
            }

            return $date;
        }
        /**
        Page controllers click: check if pagecontroller has clicked and change page to view
        **/
        function pagecontrollersClick() {
            $(".pagecontroller").on("click", function () {
                // on click on button do something
                if ($(this).val() == "first") {
                    currentPage = 0;
                    paginate(currentPage, numPerPage);
                } else if ($(this).val() == "last") {
                    currentPage = numPages - 1;
                    paginate(currentPage, numPerPage);
                } else if ($(this).val() == "prev") {
                    if (currentPage != 0) {
                        currentPage = currentPage - 1;
                        paginate(currentPage, numPerPage);
                    }
                } else if ($(this).val() == "next") {
                    if (currentPage != numPages - 1) {
                        currentPage = currentPage + 1;
                        paginate(currentPage, numPerPage);
                    }
                } else {
                    currentPage = $(this).val() - 1;
                    paginate(currentPage, numPerPage);
                }
                // Reset class and give to currentPage
                $(".pagecontroller-num").removeClass("currentPage");
                $(".pagecontroller-num")
                    .eq(currentPage)
                    .addClass("currentPage");

                filterPages();
            });
        }

        function filterPages() {
            $(".pagecontroller-num")
                .hide()    
                .filter(function(i, el) {
                    let mid = Math.ceil(numOfPages / 2);
                    if (currentPage < mid) {
                        if(i < numOfPages) return true;
                    } else if(currentPage > (numPages - (numOfPages - 1))) {
                        if(i >= numPages - numOfPages) return true;
                    } else {
                        if(numOfPages % 2 == 0) {
                            if(i >= currentPage - mid && i < currentPage + mid) return true;
                        } else {
                            if(i > currentPage - mid && i < currentPage + mid) return true;
                        }
                    }
                })
                .show();
        }

        /**
        Translating function
        string = string to be translated
        **/
        function translate(string) {
            return string;
        }

        /**
        Debug function
        name = label for data
        string = string to pass by console.log
        **/
        function cLog(name, string = null) {
            console.log(name);
            if (string != null) {
                console.log(JSON.parse(JSON.stringify(string)));
            }
        }
    };
})(jQuery);
