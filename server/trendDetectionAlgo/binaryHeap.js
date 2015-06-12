
	var topK = {

	};


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
			var isLeftLesser = this.content[i*2][this.propertyToCompare] < this.content[i*2+1][this.propertyToCompare];
			var childIndex = isLeftLesser ? i*2: i*2+1;

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

	var h = new BinaryHeap("count",[{favorID:"5", count: 1}],3);

	h.insert({favorID:'6', count:0});
		h.insert({favorID:'7', count:-1});
				h.insert({favorID:'9', count:-1});


	console.log(h.content);
	console.log(topK);
	var processNew = function(favorID) {


		
	};




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

