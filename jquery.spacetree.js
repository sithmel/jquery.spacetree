// Authors: Maurizio Lupo <maurizio.lupo@redomino.com> and contributors (see docs/CONTRIBUTORS.txt)
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as published
// by the Free Software Foundation.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA
// 02111-1307, USA.

/*
***********************************************
*************** Show as tree ******************
***********************************************

This plugin transform a list of lists into a spacetree http://thejit.org

**************************
Parameters
**************************

settings
-----------------------------------------------

(see default_config for examples):

- getData($node)
returns an object with data ($content must be a jquery node)

- getId($node)
returns the unique identifier of a node

- getChildrenNodes($node)
returns a list of nodes

- getTreeContainerId : function($node,index)
It returns a container where I can place the spacetree

- getSelected: function($tree)
It returns the selected node


jitsettings
-------------------
configuration of spacetree
see the official documentation
http://thejit.org/static/v20/Docs/files/Visualizations/Spacetree-js.html
http://thejit.org/static/v20/Docs/files/Options/Options-Controller-js.html#Options.Controller


**************************
Default html markup
**************************

This is the default html configuration:

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

*/

jQuery.fn.spacetree = function(settings, jitsettings, onClickOptions) {
    var default_config = {
        getData : function($node){
            return {
//                $content : $node.children('div').clone(true)
                $content : $node.children('div')
            }
        },
        getId : function($node){
            return 'satree_' + $node.children('div').attr('id');
        },
        getChildrenNodes : function($node){
            return $node.children('ul').children();
        },
        getTreeContainerId : function($node,index){
            var STId = 'spacetree' + index.toString();
            jQuery('<div id="' + STId + '" />')
                .width(600)
                .height(400)
                .insertAfter($node);
            return STId
        },
        getSelected : function($tree){
            return $tree.find('.selected').parent();
        }
    };

    var default_jitconfig = {
        levelsToShow: 1,
        duration: 300,  
        transition: $jit.Trans.Quart.easeInOut,  
        levelDistance: 50,  
        Navigation: {  
          enable:true,  
          panning:true  
        },  
        Node: {  
            height: 40,  
            width: 100,  
            type: 'rectangle',  
            color: '#fff',  
        },  
        Edge: {  
            type: 'bezier',  
        },
        orientation: "top",  
        siblingOffset: 10
    };

    var default_onClickOptions = {};

    var jitconfig = jQuery.extend(default_jitconfig,jitsettings);
    var onClickConfig = jQuery.extend(default_onClickOptions,onClickOptions);
    var config = jQuery.extend(default_config,settings);
    
    return this.each(function(index) {
        // step 1 create json object for spacetree
        var $firstnode = jQuery(this);
        $firstnode.hide();
        var nodeToJSON = function ($node){
            var json = {
                'id':config.getId($node),
                'name':config.getId($node), // delete this ???
                'data':config.getData($node),
                'children':[]
            };
            config.getChildrenNodes($node).each(function (){
                json.children.push(nodeToJSON(jQuery(this)));
            });
            
            return json;
        };

        var json = nodeToJSON($firstnode);
        //step 2 setting up spacetree

        jitconfig.injectInto = config.getTreeContainerId($firstnode,index)
        jitconfig.onCreateLabel = function(label, node){  
            label.id = node.id;              
            node.data.$content
            .appendTo(label)
            .width(node.Config.width)
            .height(node.Config.height);

            label.onclick = function(){  
                st.onClick(node.id,onClickConfig);  
            };  
        }

        var st = new $jit.ST(jitconfig);

        //load json data  
        st.loadJSON(json);  
        //compute node positions and layout  
        st.compute();

        var selected = config.getSelected($firstnode);

        if(selected.length){
            st.onClick(config.getId(selected),onClickConfig); 
        }
        else{
            //emulate a click on the root node.  
            st.onClick(st.root,onClickConfig); 
        }


    });
};

