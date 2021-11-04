const d3 = require("../../static_files/d3.js")

module.exports = ({ treeData, onNodeClick = () => {} }) => {
    const container = <div></div>
    const mainAccentColor = "red"

    let margin = { top: 30, right: 60, bottom: 30, left: 60 },
        width = 300 - margin.right - margin.left,
        height = 280 - margin.top - margin.bottom,
        nodeWidth = 16,
        nodeHeight = 16

    let i = 0
    let tree = d3.layout.tree().size([height, width]).nodeSize([nodeWidth, nodeHeight])

    let diagonal = d3.svg.diagonal().projection(function (d) {
        return [d.x, d.y]
    })

    let svg = d3
        .select(container)
        .append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (width / 2 + margin.left) + "," + margin.top + ")")

    root = treeData

    update(root)

    function update(source) {
        // Compute the new tree layout.
        let nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes)

        // Normalize for fixed-depth.
        nodes.forEach(function (d) {
            d.y = height - d.depth * 80
        })

        // Declare the nodes…
        let node = svg.selectAll("g.node").data(nodes, function (d) {
            return d.id || (d.id = ++i)
        })

        // Enter the nodes.
        let nodeEnter = node
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")"
            })

        // Red outlines on hover on nodes
        nodeEnter
            .filter((d) => d.level === "red")
            .insert("circle", ":first-child")
            .classed("circleSelect", true)
            .attr("r", 8)
            .style("stroke", "#000")
            .style("fill", "none")
            .style("pointer-events", "none")

        // Construction of basic nodes of tree
        nodeEnter
            .append("circle")
            .attr("r", function (d) {
                if (d.level == "none") {
                    return 0
                } else {
                    return 4
                }
            })
            .attr("r", function (d) {
                if (d.level == "none") {
                    return 0
                } else {
                    return 4
                }
            })
            .classed("basicNode", (d) => d.level == "red")
            .on("click", function (d) {
                if (d.level === "red") {
                    // makes all other nodes execpt for focus become grey
                    svg.selectAll("g.node circle.basicNode").classed("highlightCircle", true)
                    d3.select(this).classed("highlightCircle", false)

                    onNodeClick(d)

                    if (d3.event.metaKey) {
                        highlightOn(d)
                    } else {
                        highlightOff(d)
                        highlightOn(d)
                    }
                    update(d)
                }
            })

        // Declare the edges
        let link = svg.selectAll("path.link").data(links, function (d) {
            return d.target.id
        })

        // Enter the edges.
        link.enter()
            .insert("path", "g")
            .attr("class", "link")
            .attr("d", diagonal)
            .attr("class", function (d) {
                return "link source-" + d.source.name + " target-" + d.target.name
            })

        // Big circle on root node
        nodeEnter
            .filter((d) => d.level === "black")
            .append("circle")
            .attr("r", 30)
            .attr("fill", mainAccentColor)
            .attr("opacity", 0.5)
            .on("click", function (d) {
                // removed all highlighting
                svg.selectAll("g.node circle.basicNode").classed("highlightCircle", false)
                highlightOff(d)
                update(d)
            })
    }

    // Grey out other edges when focused on one node
    highlightOn = function (d) {
        d3.selectAll("path.link").classed("highlight", true)

        let parentLine
        parentLine = function (d) {
            if (d.parent) {
                parentLine(d.parent)
                d3.selectAll("path.link.source-" + d.parent.name + ".target-" + d.name).classed("highlight", false)
            }
        }
        parentLine(d)
        return update(d)
    }

    highlightOff = function (d) {
        d3.selectAll("path.link").classed("highlight", false)
        return update(d)
    }

    return container
}
