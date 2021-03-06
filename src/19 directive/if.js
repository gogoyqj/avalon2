avalon.directive("if", {
    priority: 10,
    update: function (val) {
        var binding = this
        var elem = this.element
        var stamp = binding.stamp = + new Date()
        var par
        var after = function() {
            if(stamp !== binding.stamp) return
            binding.recoverNode = null
        }
        if(binding.recoverNode) binding.recoverNode() // 还原现场，有移动节点的都需要还原现场
        try {
            if (!elem.parentNode) return
            par = elem.parentNode
        } catch (e) {
            return
        }
        if (val) { //插回DOM树
            function alway() {// jshint ignore:line
                if (elem.getAttribute(binding.name)) {
                    elem.removeAttribute(binding.name)
                    scanAttr(elem, binding.vmodels)
                }
                binding.rollback = null
            }
            if (elem.nodeType === 8) {
                var keep = binding.keep
                var hasEffect = avalon.effect.apply(keep, 1, function () {
                    if(stamp !== binding.stamp) return
                    elem.parentNode.replaceChild(keep, elem)
                    elem = binding.element = keep //这时可能为null
                    alway()
                }, after)
                hasEffect = hasEffect === false
            }
            if (!hasEffect)
                alway()
        } else { //移出DOM树，并用注释节点占据原位置
            if (elem.nodeType === 1) {
                var node = binding.element = DOC.createComment("ms-if"),
                    pos = elem.nextSibling
                binding.recoverNode = function() {
                    binding.recoverNode = null
                    if(node.parentNode !== par) {
                        par.insertBefore(node, pos)
                        binding.keep = elem
                    }
                }
                avalon.effect.apply(elem, 0, function () {
                    binding.recoverNode = null
                    if(stamp !== binding.stamp) return
                    elem.parentNode.replaceChild(node, elem)
                    binding.keep = elem //元素节点
                    ifGroup.appendChild(elem)
                    binding.rollback = function () {
                        if (elem.parentNode === ifGroup) {
                            ifGroup.removeChild(elem)
                        }
                    }
                }, after)
            }
        }
    }
})


