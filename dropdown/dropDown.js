/**
 * Created by luofeng on 2015-10-29.
 请求返回数据格式：{"CLASS":1,"DATA":[{ NAME: '张三', VALUE: '1' }, { NAME: '李四', VALUE: '2' }, { NAME: '王二', VALUE: '3'}]}

 取值：$.attr('strVale')
 */
(function ($) {
    $.fn.dropDown = function (options) {
        var opts = $.extend({}, $.fn.dropDown.Defaults, options);
        return this.each(function () {
            //alert("123");
            var $This = this;
            $($This).html("");
            var ischange = true;//是否触发change事件
            var objName = $This.id;
            var inputID = objName + '_dropDown_txt';
            $($This).attr("strVale", '');
            createList();
            eventBind();
            setStyle();
            function createList() {
                var html = [];
                $.ajax({
                    type: "post",
                    url: opts.PostUrl + "?xx=" + new Date().toLocaleDateString(),
                    data: opts.PostData,
                    async: false,
                    dataType: "text",
                    beforeSend: function () {
                        html.push("<input id='" + inputID + "' class='dropDown-input' type='text' strVale=''>");
                    },
                    success: function (d) {
                        var objJson = $.parseJSON(d);
                        if (objJson.CLASS == '0') {
                            alert(objJson.DATA);
                            return;
                        }
                        var dataList = objJson.DATA;
                        //[{ NAME: '张三', VALUE: '1' }, { NAME: '李四', VALUE: '2' }, { NAME: '王二', VALUE: '3'}];
                        html.push("<ul class='dropDown-UL'>");
                        $.each(dataList, function (i, obj) {
                            var liID = objName + '_li' + i;
                            html.push("<li><input type='checkbox' value='" + obj.VALUE + "' id='" + liID + "'><label for='" + liID + "'>" + obj.NAME + "</label></li>");
                        });
                        html.push("</ul>");
                    },
                    error: function (a, b, c) { alert(c) }
                })

                $($This).append(html.join(''));
            }
            function eventBind() {
                mouseOverAndOf();
                changeResault();
            }
            function mouseOverAndOf() {
                $(document).click(function (e) {
                    var event = e || window.event,
                        tag = event.target || event.srcElement;
                    if ($(tag).closest($($This)).length != 0) {
                        $($This).find("ul").show();
                        ischange = true;
                    }
                    else {
                        $($This).find("ul").hide();
                        if (ischange) {
                            opts.onchange();
                            ischange = false;
                        }
                    }

                });
            }
            function changeResault() {
                $($This).find("input[type='checkbox']").change(function () {
                    var data = getValue();
                    $("#" + inputID).val(data.strName).attr("strVale", data.strVal);
                    $($This).attr("strVale", data.strVal);
                })
            }
            function getValue() {
                var resVal = "", resNam = "", res = {};
                $.each($($This).find("input[type='checkbox']"), function (i, obj) {
                    if ($(obj).attr("checked")) {
                        resVal += $(obj).val() + "|";
                        resNam += $(obj).next().text() + "|";
                    }

                });
                resVal = resVal.substr(0, resVal.length - 1);
                resNam = resNam.substr(0, resNam.length - 1);
                res.strName = resNam;
                res.strVal = resVal;

                return res;

            }
            function setStyle() {
                $($This).css({
                    display: 'inline',
                    position: 'relative'
                });
            }












        });
    };

    $.fn.dropDown.Defaults = {
        PostUrl: "AjaxPost.aspx",
        PostData: {},
        onchange: function (d) { }
    };


})($);
