


	var makeNode = function(votes) {
		this.votes = votes || 0;
	}

	var BinaryHeap = function(propertyToCompare, arr) {
		this.content = [null]
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

		peak: function(object) {
			return this.content[1];
		},

		insert: function(object) {
			this.bubble(this.content.push(object)-1);
		},


		removeMin: function() {
			var minObject = this.content[1];
			this.content[1] = this.content.pop();
			this.sink(1);

			return minObject;
		},

		/**
		*auxiliary methods
		*/

		bubble: function(i) {
			var parentIndex = Math.floor(i/2);
			if(this.content[parentIndex] > this.content[i] && i>1) {
				this.swap(i, parentIndex);
				this.bubble(parentIndex);
			}

		},

		sink: function(i) {
			var isLeftLesser = this.content[i*2] < this.content[i*2+1];
			var childIndex = isLeftLesser ? i*2: i*2+1;

			if(this.content[childIndex]< this.content[i]){
				this.swap(i, childIndex);
				this.sink(i);
			}
		},
    	
    	swap: function(i,j) {
        	if (j< 0) j += this.content.length; 
        	this.content[i] ^= this.content[j];
        	this.content[j] ^= this.content[i];
        	this.content[i] ^= this.content[j];
    	}


	}



var heap = new BinaryHeap("",[ 0, 3, 1, 5, 9, 2 ]);
console.log(heap.content);
debugger;

heap.insert(-2);
console.log(heap.content);

