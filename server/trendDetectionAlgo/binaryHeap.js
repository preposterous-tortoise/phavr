	
	var topK = {};

	var makeNode = function(votes) {
		this.votes = votes || 0;
	}

	var BinaryHeap = function(propertyToCompare, arr, k) {
		this.content = [null]

		this.propertyToCompare = propertyToCompare;
		this.k = k;
		if(arr) arr.forEach(this.insert.bind(this));

		this.getVal = function(i) {
			return this.content[i][propertyToCompare];
		}

	}

	//
	BinaryHeap.prototype = {

		/**
		* API methods
		*/
		isFull: function(){
			return this.content.length > this.k  ? true : false;
		},

		isEmpty: function() {
			return this.content.length === 1 ? true : false;
		},

		peak: function(object) {
			return this.content[1];
		},

		insert: function(object) {


			if(!this.isFull()) {

				//insert into min heap, and bubble to correct position
				topK[object.favorID] = this.content.length;
				this.bubble(this.content.push(object)-1);
			}
		},


		remove: function() {

			if(!this.isEmpty()){


				var minObject = this.content[1];
				if(this.content.length === 2) {
					this.content.pop();
				} else {
					this.content[1] = this.content.pop();
					this.sink(1);
				}

				return minObject;
				
			}
		},

		/**
		*auxiliary methods
		*/

		bubble: function(i) {
			var parentIndex = Math.floor(i/2);

			if(i>1 &&this.content[parentIndex][this.propertyToCompare] > this.content[i][this.propertyToCompare]) {
				this.swap(i, parentIndex);
				this.bubble(parentIndex);
			}

		},

		sink: function(i) {
			var childIndex;
			var isLeftLesser;
			if( this.content[i*2] === undefined && this.content[i*2+1]=== undefined ){
				return;

			}else if( this.content[i*2] === undefined){
				isLeftLesser = false;
			}else if( this.content[i*2+1] === undefined) {
				isLeftLesser = true;
			}else {
				//both child exists
				isLeftLesser = this.content[i*2][this.propertyToCompare] < this.content[i*2+1][this.propertyToCompare];
			}
			
			childIndex = isLeftLesser ? i*2: i*2+1;
			if(this.content[childIndex][this.propertyToCompare]< this.content[i][this.propertyToCompare]){
				this.swap(i, childIndex);
				this.sink(i);
			}
		},
    	
    	swap: function(i,j) {
        	if (j< 0) j += this.content.length; 


        	//update hashtable with new indexes
        	topK[this.content[i]["favorID"]] = j;
        	topK[this.content[j]["favorID"]] = i;


        	var temp = this.content[i];
        	this.content[i] = this.content[j];
        	this.content[j] = temp;

    	}


	}



	/**
	*	Look at element in data stream
	*/
		var h = new BinaryHeap("count",[],3);
		var decrementCounter = 0;

	var processNew = function(favorID, time) {



		//check whether favor is already in top K
		if(topK[favorID]) {
			//if already in topK, increment it
			h.content[topK[favorID]].count++;
			h.sink(topK[favorID]);
		}else {

			if(h.isFull()){
				//if full, decrement everything
				decrementCounter--;
				var minElement= h.peak();

				while( minElement && minElement.count + decrementCounter <=0 ) {
					h.remove();
					delete topK[minElement.favorID];
					minElement  = h.peak();
				}
				
			} else {
				h.insert({favorID:favorID, count:1 - decrementCounter, time:time});
			}

		}


				setTimeout(function(){
					console.log(favorID);
					console.log(topK);
					console.log(h.content);
			h.content[topK[favorID]].count = -999;
			h.bubble(topK[favorID]);
			h.remove();
								// console.log(topK);

			delete topK[favorID];
			console.log(h.content);
		}, 3000);

		
	};
	console.log();
	processNew('a',(new Date()).getTime());
		processNew('b',(new Date()).getTime());





	console.log(h.content);
	console.log(topK);

/**
* Now figure out whether the frequencies are accurate
* auto time expiry nodes 
*/

// var heap = new BinaryHeap("",[1],3);
// heap.remove();

// heap.remove();
// heap.insert(1);
// heap.insert(2);
// heap.remove();
// heap.insert(2);

// heap.remove();
// heap.remove();

// console.log(heap.content);

