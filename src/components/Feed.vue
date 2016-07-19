<template>
  <media :video="video" :playlist="[]" :scale="scales.normal" ></media>
</template>

<script>
import {MEDIA_SCALE_NORMAL, MEDIA_SCALE_LARGE} from '../constants/config'
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'
import Waterfall from 'vue-waterfall/lib/waterfall'
import Media from './media'

export default {
  name: 'Feed',

  components: {
    Waterfall, WaterfallSlot, Media
  },

  data () {
    return {
      video: {
        id: '16',
        hash: '4322553893b442094406e1d5524fbdc2',
        collection: '156',
        originalUrl: 'http://www.dailymotion.com/video/x2ih1h4_fantastic-four-director-talks-johnny-storm-s-race-ign-news_',
        embedUrl: 'https://www.dailymotion.com/embed/video/x2ih1h4',
        duration: '00:01:11',
        createdAt: '2016-07-06T08:32:40.789855Z',
        isNaughty: 'false',
        isPrivate: 'false',
        poster: 'http://s2.dmcdn.net/JMwDE/x720-JQM.png',
        title: 'Fantastic Four Director Talks Johnny Storm\'s Race - IGN News',
        slug: 'fantastic-four-director-talks-johnny-storms-race-ign-news'
      },
      scales: {
        normal: MEDIA_SCALE_NORMAL,
        large: MEDIA_SCALE_LARGE
      }
    }
  }
}
</script>
