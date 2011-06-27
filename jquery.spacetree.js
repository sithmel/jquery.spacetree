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

jQuery.fn.spacetree = function(selector, settings, jitsettings, onClickOptions) {
    var st_placeholder = jQuery(selector).get(0);
    var default_config = {
        getData : function($node){
            return { $content : $node.children('div').clone(true)}
        },
        getId : function($node){
            return 'satree_' + $node.children('div').attr('id');
        },
        getChildrenNodes : function($node){
            return $node.children('ul').children();
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
    

    var $firstnode = this.eq(0);
    // step 1 create json object for spacetree
    
    var selected = config.getSelected($firstnode);
    var selected_id;
    if(selected.length){
        selected_id = config.getId(selected);
    }

    var nodeToJSON = function ($node){
        var json = {
            'id':config.getId($node),
            'name':config.getId($node), 
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
    jitconfig.injectInto = st_placeholder;
    jitconfig.onCreateLabel = function(label, node){  
        label.id = node.id;              
        node.data.$content
        .appendTo(label)
        .width(node.Config.width)
        .height(node.Config.height);

        if(label.id === selected_id){
            jQuery(label).addClass('selectednode');
        }

        label.onclick = function(){
            jQuery(st_placeholder).find('.node').removeClass('selectednode');
            jQuery(this).addClass('selectednode');

            st.onClick(node.id,onClickConfig);  
        };  
    }

    var st = new $jit.ST(jitconfig);

    //load json data  
    st.loadJSON(json);  
    //compute node positions and layout  
    st.compute();

    var selected = config.getSelected($firstnode);

    if(selected_id){
        st.onClick(selected_id,onClickConfig); 
    }
    else{
        //emulate a click on the root node.  
        st.onClick(st.root,onClickConfig); 
    }

    jQuery(window).resize(function (){
        var $win = jQuery(st_placeholder);
        var w = $win.width(), h = $win.height();
        st.canvas.resize(w, h); 
    });
    return this;

};

