function parseDisplay(nodeName, val) {
    //用于取得此类标签的默认display值
    var key = "_" + nodeName
    if (!parseDisplay[key]) {
        var node = DOC.createElement(nodeName)
        root.appendChild(node)
        if (W3C) {
            val = getComputedStyle(node, null).display
        } else {
            val = node.currentStyle.display
        }
        root.removeChild(node)
        parseDisplay[key] = val
    }
    return parseDisplay[key]
}

avalon.parseDisplay = parseDisplay

avalon.directive("visible", {
    init: function (binding) {
    },
    update: function (val) {
        var elem = this.element,
                binding = this,
                stamp = binding.stamp = +new Date()
        if (val) {
            elem.style.display = "none"
            avalon.effect.apply(elem, 1, function () {
                if (stamp !== binding.stamp)
                    return
                var data = elem.getAttribute("data-effect-driver") || "a"
                if (/^[atn]/.test(data)) {
                    if (!this.effectName)
                        elem.style.display = ""//这里jQuery会自动处理
                    if (avalon(elem).css("display") === "none") {
                        elem.style.display = parseDisplay(elem.nodeName)
                    }
                }
            })
        } else {
            avalon.effect.apply(elem, 0, function () {
                if (stamp !== binding.stamp)
                    return
                elem.style.display = "none"
            })

        }
    }
})
