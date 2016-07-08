<template>
  <section class="collection clearfix">
    <div class="tools">
      <button class="">A</button>
      <button class="">B</button>
      <button class="">C</button>
    </div>
    <article class="rack" v-for="n in 10 | orderBy 'created_at' -1">
      <div class="{{$index === 0 ? 'cover' : 'thumb thumb-' + $index}} {{collection.videos[$index] ? '' : 'empty'}}">
        <div v-if="collection.videos.length === 0 && $index === 0" class="nothing">
          <p>There's nothing here... yet.<br>
          <a v-if="areMyOwn" href="#">Add a video</a></p>
        </div>
        <a href="#"><img v-if="collection.videos[$index]" v-bind:src="collection.videos[$index].poster" width="auto" height="100%"></a>
      </div>
    </article>
    <article>
      <a href="#" class="thumb thumb-more">more...</a>
    </article>
  </section>
</template>

<script>
export default {
  name: 'CollectionRack',

  props: ['collection', 'areMyOwn']
}
</script>

<style lang="scss" scoped>
.tools {
  float: left;

  button {
    width: 50px;
    height: 50px;
    display: block;
  }
}

.rack {
  float: left;
}

.collection {
  width: 100%;
  height: 200px;
  margin-bottom: 10px;
  border-bottom: 1px solid #CCCCCC;
}

.cover {
  overflow: hidden;
  width: 300px;
  margin-left: 10px;
  height: 180px;
  float: left;
  background-color: black;
}

.thumb {
  overflow: hidden;
  width: 140px;
  height: 85px;
  float: left;
  background-color: black;
  margin-bottom: 10px;
  margin-left: 10px;
  display: none;
}

.thumb-more {
  background-color: #CCCCCC;
}

.empty {
  background-color: #CCCCCC;
}

@media screen and (min-width: 1200px) {
  .thumb-0,
  .thumb-1,
  .thumb-2,
  .thumb-3,
  .thumb-4,
  .thumb-5,
  .thumb-6,
  .thumb-7,
  .thumb-8,
  .thumb-9,
  .thumb-more {
    display: block;
  }
}

@media screen and (max-width: 1200px) {
  .cover {
    width: 280px;
  }

  .thumb {
    width: 132px;
  }

  .thumb-0,
  .thumb-1,
  .thumb-2,
  .thumb-3,
  .thumb-4,
  .thumb-5,
  .thumb-6,
  .thumb-7,
  .thumb-more {
    display: block;
  }
}

@media screen and (max-width: 990px) {
  .cover {
    width: 204px;
  }

  .thumb-0,
  .thumb-1,
  .thumb-2,
  .thumb-3,
  .thumb-4,
  .thumb-5,
  .thumb-more {
    display: block;
  }

  .thumb-6,
  .thumb-7,
  .thumb-8,
  .thumb-9 {
    display: none;
  }
}

@media screen and (max-width: 770px) {
  .thumb {
    width: 131px;
  }

  .thumb-0,
  .thumb-1,
  .thumb-2,
  .thumb-3,
  .thumb-more {
    display: block;
  }

  .thumb-4,
  .thumb-5,
  .thumb-6,
  .thumb-7,
  .thumb-8,
  .thumb-9 {
    display: none;
  }
}

@media screen and (max-width: 575px) {
  .thumb {
    width: 130px;
  }
}

@media screen and (max-width: 574px) {
  .cover {
    width: 100%;

    img {
      width: 100%;
      height: auto;
    }
  }

  .rack {
    width: calc(100% - 60px);
  }

  .thumb-1,
  .thumb-2,
  .thumb-3,
  .thumb-4,
  .thumb-5,
  .thumb-6,
  .thumb-7,
  .thumb-8,
  .thumb-9 {
    display: none;
  }

  .thumb-more {
    margin-top: -85px;
    width: 90px;
    height: 75px;
    position: relative;
    margin-left: calc(100% - 100px);
  }
}
</style>
