(function($){

  var Renderer = function(canvas){
    var canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d");
    var particleSystem

    var that = {
      init:function(system){
        //
        // the particle system will call the init function once, right before the
        // first frame is to be drawn. it's a good place to set up the canvas and
        // to pass the canvas size to the particle system
        //
        // save a reference to the particle system for use in the .redraw() loop
        particleSystem = system

        // inform the system of the screen dimensions so it can map coords for us.
        // if the canvas is ever resized, screenSize should be called again with
        // the new dimensions
        particleSystem.screenSize(canvas.width, canvas.height) 
        particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side
        
        // set up some event handlers to allow for node-dragging
        that.initMouseHandling()
      },
      
      redraw:function(){
        // 
        // redraw will be called repeatedly during the run whenever the node positions
        // change. the new positions for the nodes can be accessed by looking at the
        // .p attribute of a given node. however the p.x & p.y values are in the coordinates
        // of the particle system rather than the screen. you can either map them to
        // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
        // which allow you to step through the actual node objects but also pass an
        // x,y point in the screen's coordinate system
        // 
        ctx.fillStyle = "white"
        ctx.fillRect(0,0, canvas.width, canvas.height)
        
        particleSystem.eachEdge(function(edge, pt1, pt2){
          // edge: {source:Node, target:Node, length:#, data:{}}
          // pt1:  {x:#, y:#}  source position in screen coords
          // pt2:  {x:#, y:#}  target position in screen coords

          // draw a line from pt1 to pt2
					
					if(edge.data.weight) {
						ctx.lineWidth = edge.data.weight;
					}
					else {
          	ctx.lineWidth = 1;
					}
          ctx.beginPath()
					ctx.strokeStyle = "#CCCCCC";
          ctx.moveTo(pt1.x, pt1.y);
					var cx = (pt1.x + pt2.x) / 2 - (pt1.y - pt2.y) /6;
					var cy = (pt1.y + pt2.y) / 2 + (pt1.x - pt2.x) /6;
          ctx.quadraticCurveTo(cx, cy, pt2.x, pt2.y);
          ctx.stroke()
        })

        particleSystem.eachNode(function(node, pt){
          // node: {mass:#, p:{x,y}, name:"", data:{}}
          // pt:   {x:#, y:#}  node position in screen coords

          // draw a rectangle centered at pt
          var w = 10
          ctx.fillStyle = (node.data.alone) ? "orange" : "black"
          ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w)
					ctx.fillStyle = "black";
					ctx.font = "10pt Calibri";
					ctx.fillText(node.name, pt.x + w, pt.y + w/2);
        })    			
      },
      
      initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        var dragged = null;

        // set up a handler object that will initially listen for mousedowns then
        // for moves and mouseups while dragging
        var handler = {
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            dragged = particleSystem.nearest(_mouseP);

            if (dragged && dragged.node !== null){
              // while we're dragging, don't let physics move the node
              dragged.node.fixed = true
            }

            $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)

            return false
          },
          dragged:function(e){
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (dragged && dragged.node !== null){
              var p = particleSystem.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },

          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            dragged = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            _mouseP = null
            return false
          }
        }
        
        // start listening
        $(canvas).mousedown(handler.clicked);

      },
      
    }
    return that
  }    

  $(document).ready(function(){
    var graph = arbor.ParticleSystem(1000, 600, 0.5) // create the system with sensible repulsion/stiffness/friction
    graph.parameters({gravity:true}) // use center-gravity to make the graph settle nicely (ymmv)
    graph.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...

    // add some nodes to the graph and watch it go...
    //var edgeList = 
		//list;
		//[{"in":"TurmBuchOch","out":"mykke_","weight":1},{"in":"tserafouin","out":"mykke_","weight":1},{"in":"TeilerDoerden","out":"mykke_","weight":1},{"in":"CDUverbot","out":"mykke_","weight":1},{"in":"creeky78","out":"mykke_","weight":1},{"in":"Ivyesque","out":"mykke_","weight":1},{"in":"es_be_er","out":"mykke_","weight":1},{"in":"r_gross_","out":"mykke_","weight":1},{"in":"christiansoeder","out":"mykke_","weight":1},{"in":"elephase","out":"mykke_","weight":1},{"in":"Kanon_xx","out":"mykke_","weight":1},{"in":"gabelspitze_","out":"mykke_","weight":1},{"in":"Stefan_Beckmann","out":"mykke_","weight":1},{"in":"8GriZz7","out":"mykke_","weight":1},{"in":"haraldmeyer","out":"mykke_","weight":1},{"in":"Anskii21","out":"haraldmeyer","weight":1},{"in":"zauberfrau","out":"haraldmeyer","weight":1},{"in":"Numpsie","out":"haraldmeyer","weight":8},{"in":"RapidRalf","out":"haraldmeyer","weight":1},{"in":"robind_at_tf","out":"haraldmeyer","weight":1},{"in":"Walisisch","out":"haraldmeyer","weight":1},{"in":"Froschwelle","out":"haraldmeyer","weight":1},{"in":"open_eye_s","out":"haraldmeyer","weight":1},{"in":"PinkesWalross","out":"8GriZz7","weight":8},{"in":"Numpsie","out":"8GriZz7","weight":3},{"in":"FlyHippie1971","out":"8GriZz7","weight":1},{"in":"mysterioes_","out":"8GriZz7","weight":1},{"in":"clutze","out":"8GriZz7","weight":2},{"in":"LucasKrause_","out":"Stefan_Beckmann","weight":7},{"in":"Riv_Kos","out":"gabelspitze_","weight":1},{"in":"dansker78","out":"gabelspitze_","weight":2},{"in":"felham","out":"gabelspitze_","weight":3},{"in":"mykke_","out":"gabelspitze_","weight":2},{"in":"ksta_news","out":"gabelspitze_","weight":1},{"in":"Cynx","out":"gabelspitze_","weight":2},{"in":"PicaPGK","out":"gabelspitze_","weight":4},{"in":"kleopatra2009","out":"elephase","weight":4},{"in":"aiida976","out":"elephase","weight":1},{"in":"ZeitRobust","out":"elephase","weight":2},{"in":"dimecuales","out":"elephase","weight":1},{"in":"kreativfreak","out":"elephase","weight":1},{"in":"MatthiasZipfel","out":"elephase","weight":1},{"in":"Ivyesque","out":"elephase","weight":1},{"in":"AndreasDresen","out":"elephase","weight":2},{"in":"KatjaPiel","out":"elephase","weight":1},{"in":"RachelRaclet","out":"elephase","weight":1},{"in":"matetee","out":"christiansoeder","weight":1},{"in":"VanessaLeibold","out":"christiansoeder","weight":1},{"in":"pettre","out":"christiansoeder","weight":1},{"in":"edomblog","out":"christiansoeder","weight":1},{"in":"giftzwockel","out":"christiansoeder","weight":1},{"in":"_tillwe_","out":"christiansoeder","weight":1},{"in":"red_hardliner","out":"christiansoeder","weight":2},{"in":"mykke_","out":"christiansoeder","weight":1},{"in":"TSmithRV","out":"christiansoeder","weight":1},{"in":"migrate89","out":"christiansoeder","weight":1},{"in":"pageissler","out":"christiansoeder","weight":1},{"in":"aristokitten","out":"christiansoeder","weight":2},{"in":"MHQuerdenker","out":"christiansoeder","weight":1},{"in":"NeboNumberOne","out":"r_gross_","weight":6},{"in":"_wfrank","out":"r_gross_","weight":4},{"in":"Niranda","out":"r_gross_","weight":1},{"in":"mathieuaqwasx5","out":"r_gross_","weight":1},{"in":"r_gross_","out":"r_gross_","weight":1},{"in":"demellguamn9","out":"r_gross_","weight":1},{"in":"Toistos","out":"r_gross_","weight":1},{"in":"UlrichCommercon","out":"es_be_er","weight":2},{"in":"jackelynwd1","out":"es_be_er","weight":1},{"in":"thobi75","out":"es_be_er","weight":1},{"in":"SebastianP1980","out":"es_be_er","weight":1},{"in":"sqeezy80","out":"es_be_er","weight":1},{"in":"buzickcxaik8","out":"es_be_er","weight":1},{"in":"julisrpk","out":"es_be_er","weight":1},{"in":"kscheib","out":"es_be_er","weight":2},{"in":"Aproonline","out":"es_be_er","weight":2},{"in":"Kunkakom","out":"es_be_er","weight":1},{"in":"FlowFXx","out":"es_be_er","weight":1},{"in":"sabinezeller","out":"es_be_er","weight":1},{"in":"britholen","out":"Ivyesque","weight":2},{"in":"fraulaube","out":"Ivyesque","weight":10},{"in":"JDCurriewriter","out":"Ivyesque","weight":1},{"in":"steffeinhorn","out":"Ivyesque","weight":2},{"in":"entropie42","out":"creeky78","weight":1},{"in":"Raetsch","out":"creeky78","weight":2},{"in":"Luziffer42","out":"creeky78","weight":2},{"in":"wortler","out":"creeky78","weight":1},{"in":"Cadann","out":"creeky78","weight":1},{"in":"Biobratwurst","out":"creeky78","weight":5},{"in":"creeky78","out":"creeky78","weight":1},{"in":"Ivyesque","out":"creeky78","weight":1},{"in":"Moltroff","out":"creeky78","weight":1},{"in":"toyf_ug","out":"CDUverbot","weight":1},{"in":"pommersche","out":"CDUverbot","weight":1},{"in":"MTW45A","out":"CDUverbot","weight":1},{"in":"SCHRLTT","out":"CDUverbot","weight":1},{"in":"UserKingsize","out":"CDUverbot","weight":1},{"in":"jolicoeur11","out":"CDUverbot","weight":2},{"in":"CDUverbot","out":"CDUverbot","weight":2},{"in":"FreeMibu","out":"CDUverbot","weight":1},{"in":"Elishan93","out":"CDUverbot","weight":1},{"in":"KoelnBusiness","out":"CDUverbot","weight":1},{"in":"HydrogenSZ","out":"CDUverbot","weight":1},{"in":"PLANETSAFER","out":"CDUverbot","weight":1},{"in":"bgebot","out":"CDUverbot","weight":1},{"in":"fmiffal","out":"TeilerDoerden","weight":2},{"in":"Michel08151","out":"TeilerDoerden","weight":1},{"in":"bootboss","out":"TeilerDoerden","weight":1},{"in":"tarzun","out":"TeilerDoerden","weight":1},{"in":"do_panic","out":"TeilerDoerden","weight":1},{"in":"swfMPc","out":"TeilerDoerden","weight":1},{"in":"TeraEuro","out":"TeilerDoerden","weight":1},{"in":"jerryweyer","out":"TeilerDoerden","weight":2},{"in":"10comm","out":"TeilerDoerden","weight":1},{"in":"crackpille","out":"TeilerDoerden","weight":1},{"in":"happiness2_u_11","out":"TeilerDoerden","weight":1},{"in":"peacyd","out":"TeilerDoerden","weight":1},{"in":"PhaidrosDA","out":"TeilerDoerden","weight":1},{"in":"zany_zigzag","out":"tserafouin","weight":1},{"in":"mykke_","out":"tserafouin","weight":1},{"in":"midsomerlover","out":"tserafouin","weight":1},{"in":"deikitschi","out":"tserafouin","weight":1},{"in":"querged8","out":"tserafouin","weight":1},{"in":"ironmadna","out":"tserafouin","weight":7},{"in":"Gundel_Gaukeley","out":"tserafouin","weight":1},{"in":"theswiss","out":"tserafouin","weight":1},{"in":"0x6d686b","out":"tserafouin","weight":1},{"in":"aynurgoek","out":"TurmBuchOch","weight":1},{"in":"NeosLove","out":"TurmBuchOch","weight":1},{"in":"Liedie40","out":"TurmBuchOch","weight":1},{"in":"Ivyesque","out":"TurmBuchOch","weight":1},{"in":"hamudistan","out":"TurmBuchOch","weight":2},{"in":"derherrgott","out":"TurmBuchOch","weight":1},{"in":"Graukarpfen","out":"TurmBuchOch","weight":1},{"in":"HerrDemodex","out":"TurmBuchOch","weight":1},{"in":"Schiefersteins","out":"TurmBuchOch","weight":1},{"in":"klaus_666","out":"TurmBuchOch","weight":1},{"in":"MahlisaStella","out":"TurmBuchOch","weight":1},{"in":"PeterHellinger","out":"TurmBuchOch","weight":1},{"in":"merquana","out":"TurmBuchOch","weight":1},{"in":"biblionomicon","out":"TurmBuchOch","weight":1}]
//		[{"in":"Meye_R","out":"andreaspfohl","weight":1},{"in":"Bastinat0r","out":"andreaspfohl","weight":4},{"in":"darian_babek","out":"Bastinat0r","weight":1},{"in":"mykke_","out":"Bastinat0r","weight":1},{"in":"piratentag","out":"Bastinat0r","weight":1},{"in":"andreaspfohl","out":"Bastinat0r","weight":2},{"in":"LeSpocky","out":"Bastinat0r","weight":2},{"in":"schoschie","out":"Bastinat0r","weight":2},{"in":"rosario_raulin","out":"Bastinat0r","weight":2},{"in":"Bastinat0r","out":"Meye_R","weight":2},{"in":"FloBraig","out":"Meye_R","weight":4},{"in":"vorsprach","out":"Meye_R","weight":5},{"in":"Die_KTS","out":"Meye_R","weight":1},{"in":"timpritlove","out":"Meye_R","weight":1},{"in":"benniH","out":"Meye_R","weight":1},{"in":"andreaspfohl","out":"Meye_R","weight":1}]
//		[{"in":"darian_babek","out":"Bastinat0r","weight":1},{"in":"mykke_","out":"Bastinat0r","weight":1},{"in":"piratentag","out":"Bastinat0r","weight":1},{"in":"andreaspfohl","out":"Bastinat0r","weight":2},{"in":"LeSpocky","out":"Bastinat0r","weight":2},{"in":"schoschie","out":"Bastinat0r","weight":2},{"in":"rosario_raulin","out":"Bastinat0r","weight":2},{"in":"Bastinat0r","out":"rosario_raulin","weight":2},{"in":"PixelRocker","out":"schoschie","weight":2},{"in":"Chiamh1979","out":"schoschie","weight":1},{"in":"JMarkMueller","out":"schoschie","weight":1},{"in":"pommersche","out":"schoschie","weight":1},{"in":"bandee_de","out":"schoschie","weight":2},{"in":"ipeluche","out":"schoschie","weight":2},{"in":"Natterta","out":"schoschie","weight":2},{"in":"Goganzeli","out":"schoschie","weight":1},{"in":"sushius","out":"schoschie","weight":1},{"in":"MOApp","out":"schoschie","weight":1},{"in":"treimannch","out":"schoschie","weight":1},{"in":"ibews","out":"LeSpocky","weight":1},{"in":"vollkorn1982","out":"LeSpocky","weight":3},{"in":"mccurlyde","out":"LeSpocky","weight":2},{"in":"Bastinat0r","out":"LeSpocky","weight":2},{"in":"auchere1","out":"LeSpocky","weight":1},{"in":"eXo_X5","out":"LeSpocky","weight":1},{"in":"modgamers","out":"LeSpocky","weight":1},{"in":"Meye_R","out":"andreaspfohl","weight":1},{"in":"Bastinat0r","out":"andreaspfohl","weight":4},{"in":"IokaMusic","out":"piratentag","weight":1},{"in":"Hypothetix","out":"piratentag","weight":1},{"in":"aureliaev","out":"piratentag","weight":1},{"in":"Netzblockierer","out":"piratentag","weight":1},{"in":"Buergerwille","out":"piratentag","weight":1},{"in":"CarmenRinkler","out":"piratentag","weight":1},{"in":"creeky78","out":"mykke_","weight":1},{"in":"Ivyesque","out":"mykke_","weight":1},{"in":"es_be_er","out":"mykke_","weight":1},{"in":"r_gross_","out":"mykke_","weight":1},{"in":"christiansoeder","out":"mykke_","weight":1},{"in":"elephase","out":"mykke_","weight":1},{"in":"Kanon_xx","out":"mykke_","weight":1},{"in":"Stefan_Beckmann","out":"mykke_","weight":1},{"in":"8GriZz7","out":"mykke_","weight":1},{"in":"haraldmeyer","out":"mykke_","weight":1},{"in":"Britscilla","out":"mykke_","weight":1},{"in":"alexf10","out":"mykke_","weight":1},{"in":"derwortfuehrer","out":"mykke_","weight":1},{"in":"peak_sound","out":"mykke_","weight":1},{"in":"AF87X","out":"mykke_","weight":1}];
		for (i in edgeList) {
			graph.addEdge(edgeList[i].in, edgeList[i].out, {'weight' : edgeList[i].weight});
		}
/*

		graph.addEdge('a', 'b');
		graph.addEdge('b', 'c');
		graph.addEdge('c', 'a');
		graph.addEdge('a', 'c');
		graph.addEdge('c', 'e');
		graph.addEdge('e', 'a');
		graph.addEdge('a', 'e');
*/


    // or, equivalently:
    //
    // graph.graft({
    //   nodes:{
    //     f:{alone:true, mass:.25}
    //   }, 
    //   edges:{
    //     a:{ b:{},
    //         c:{},
    //         d:{},
    //         e:{}
    //     }
    //   }
    // })
    
  })

})(this.jQuery)
