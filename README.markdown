JQuery.spacetree
================

This plugin transform a tree structured html into a spacetree using Javascript Infovis Toolkit (http://thejit.org)

How to use
==========
Launch with:
    $(htmltree_selector).spacetree(spacetree_selector, settings, jitsettings, onClickOptions);

Minimal example:
    $('#tree').spacetree('#spacetree');

Parameters
==========

htmltree_selector
-----------------
A css selector to the HTML tree.

spacetree_selector
------------------
A css selector pointing to the container where the spacetree will be drawn

settings
--------
A Javascript object containing a group of function. These function will overrides the default functions used to extracting the tree informations.
These are:

- getData($node)
$node is a node of the html tree (jQuery object)
returns an object. This object will be the 'data' object of each node (see the jit documentation).
Important: the object must contain a '$content' field with the label to print on each spacetree node.

- getId($node)
$node is a node of the html tree (jQuery object)
returns the unique identifier of a node (string)

- getChildrenNodes($node)
$node is a node of the html tree (jQuery object)
returns a list of nodes (sons of the current node)

- getSelected: function($tree)
$tree is the first node of the html tree (jQuery object)
It returns the selected node (a jQuery object)

jitsettings
-----------
configuration of spacetree
see the official documentation:
- http://thejit.org/static/v20/Docs/files/Visualizations/Spacetree-js.html
- http://thejit.org/static/v20/Docs/files/Options/Options-Controller-js.html#Options.Controller

onClickOptions
--------------
See the onClick documentation on:
http://thejit.org/static/v20/Docs/files/Visualizations/Spacetree-js.html

Default html markup
===================

This is an example of the default html:


    <div id="tree">
        <div id="root">root element content</div>
        <ul>
            <li>
                <div id="child1">child element content</div>
                <ul>
                    <li>
                        ...
                    </li>
                </ul>
            </li>
            <li>
                <div id="child2" class="selected">child element content</div>
            </li>
        </ul>
    </div>


