	var topK = {

	};


	var processNew = function(favorID) {


	};




	var makeNode = function(votes) {
		this.votes = votes || 0;
	}

	var BinaryHeap = function(propertyToCompare, arr, k) {
		this.content = [null]
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





var heap = new BinaryHeap("",[1],3);
heap.remove();

heap.remove();
heap.insert(1);
heap.insert(2);
heap.remove();
heap.insert(2);

heap.remove();
heap.remove();


console.log(heap.content);

