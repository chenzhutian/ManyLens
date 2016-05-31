using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;

namespace ManyLens.Models
{

    public class Term : DerivedTweetSet
    {
        private string id;
        private DateTime termDate;
        private bool isTweetBurstPoint;//1 = this day is a burst point or 0=not in terms of tweetFreq or smoothedTweetFreq
        private double tweetBurstCutoff;//cutoff of tweet
        
        private uint pointType = 0; // 1 = start, 2 = end, 3 = start+end, 4 = inside
        private string begPoint;
        private string endPoint;
        private bool isPeak = false;

        //private double virtualCount = -1;
        //private double tempVirtualCount = 0;

        #region Getter & Setter
        public String ID
        {
            get
            {
                return this.id;
            }
        }

        public DateTime TermDate
        {
            get
            {
                return this.termDate;
            }
            private set
            {
                this.termDate = value;
            }
        }
        public bool IsTweetBurstPoint
        {
            get
            {
                return this.isTweetBurstPoint;
            }
            set
            {
                this.isTweetBurstPoint = value;
            }
        }

        public double TweetBurstCutoff
        {
            get
            {
                return this.tweetBurstCutoff;
            }
            set
            {
                this.tweetBurstCutoff = value;
            }
        }
        public uint PointType
        {
            get
            {
                return this.pointType;
            }
            set
            {
                this.pointType = value;
            }
        }
        public bool IsPeak
        {
            get
            {
                return this.isPeak;
            }
            set
            {
                this.isPeak = value;
            }
        }
        public string BeginPoint
        {
            get
            {
                return this.begPoint;
            }
            set
            {
                this.begPoint = value;
            }
        }
        public string EndPoint
        {
            get
            {
                return this.endPoint;
            }
            set
            {
                this.endPoint = value;
            }
        }

        public int DTweetsCount
        {
            get
            {
                if (this.HasPreprocessed) return this.Tweets.Count;
                this.PreproccessingParallel();
                return this.Tweets.Count;
            }
        }

        #endregion
        public Term(string date)
            : base()
        {
            string formatString = "yyyyMMddHHmmss";
            this.TermDate =DateTime.ParseExact(date, formatString, null);
            this.id = date;//date.ToString("yyyyMMddHHmmss");
        }

        public Term(DateTime date)
            :base()
        {
            this.TermDate = date;
            this.id = date.ToString("yyyyMMddHHmmss");
        }

        public void AddTweet(Tweet tweet)
        {
            base.AddTweet(tweet);
        }


        public List<VoronoiTweetsFeature> GetVoronoiTweetsFeatures()
        {
            List<VoronoiTweetsFeature> features = new List<VoronoiTweetsFeature>();
            string follower = "follower";
            string following = "following";
            string tweetLength = "tweetLength";
            string hastagCount = "hastagCount";
            string isV = "isV";
            int sampleCount = (int)(this.TweetsCount * 0.001);
            if (sampleCount < 10) sampleCount = 20;
            Random rnd = new Random();

            Dictionary<Tweet, double> tweetsScore = new Dictionary<Tweet, double>();
            this.Tweets.ForEach(t =>
            {
                double score = t.User.KloutScore;//t.User.Follower / (1+Math.Log( t.User.Following +1));
                tweetsScore.Add(t, score);
            });

            foreach(KeyValuePair<Tweet,double> item in tweetsScore.OrderByDescending(t => t.Value).Take(sampleCount).ToList())
            {
                Tweet t = item.Key;
                features.Add(new VoronoiTweetsFeature() { id = t.TweetID + "_0", feature_type = follower, feature_value = t.User.Follower });
                features.Add(new VoronoiTweetsFeature() { id = t.TweetID + "_1", feature_type = isV, feature_value = t.User.IsV ? 1 : 0});
                features.Add(new VoronoiTweetsFeature() { id = t.TweetID + "_2", feature_type = tweetLength, feature_value = t.Length });
                features.Add(new VoronoiTweetsFeature() { id = t.TweetID + "_3", feature_type = hastagCount, feature_value = t.HashTag.Count });
            }

            return features.OrderBy(t => t.feature_type).ToList();
            //List<Tweet> tweets = new List<Tweet>();
            //while (tweets.Count < sampleCount)
            //{
            //    int index = rnd.Next(this.TweetsCount);
            //    Tweet t = this.Tweets[index];
            //    if (tweets.Contains(t)) continue;
            //    features.Add(new VoronoiTweetsFeature() { id = t.TweetID + "_0", feature_type = follower, feature_value = t.User.Follower });
            //    features.Add(new VoronoiTweetsFeature() { id = t.TweetID + "_1", feature_type = following, feature_value = t.User.Following });
            //    features.Add(new VoronoiTweetsFeature() { id = t.TweetID + "_2", feature_type = tweetLength, feature_value = t.Length });
            //    features.Add(new VoronoiTweetsFeature() { id = t.TweetID + "_3", feature_type = hastagCount, feature_value = t.HashTag.Count });
            //    tweets.Add(t);
            //}
            //return features.OrderBy(f => f.feature_type).ToList();

            //var tweets = this.Tweets.OrderByDescending(t=>t.User.Follower).Take(sampleCount);
            //foreach(Tweet t  in tweets )
            //{
            //      features.Add(new VoronoiTweetsFeature() { id = t.TweetID+"_0", feature_type = follower, feature_value = t.User.Follower });
            //}

            //tweets = this.Tweets.OrderByDescending(t=>t.User.Following).Take(sampleCount);
            //foreach(Tweet t in tweets)
            //{
            //    features.Add(new VoronoiTweetsFeature() { id = t.TweetID+"_1", feature_type = following, feature_value = t.User.Following });
            //}

            //tweets = this.Tweets.OrderByDescending( t => t.Length).Take(sampleCount);
            //foreach(Tweet t in tweets)
            //{
            //    features.Add(new VoronoiTweetsFeature(){ id = t.TweetID+"_2", feature_type = tweetLength, feature_value = t.Length });
            //}

            //tweets = this.Tweets.OrderByDescending(t=>t.HashTag.Count).Take(sampleCount);
            //foreach(Tweet t in tweets)
            //{
            //    features.Add(new VoronoiTweetsFeature(){ id = t.TweetID+"_3", feature_type = hastagCount, feature_value = t.HashTag.Count});
            //}

        
        }

        public void Preproccessing()
        {
            ManyLens.Preprocessing.TweetsPreprocessor.ProcessTweet(this);
        }

        public void PreproccessingParallel()
        {
            ManyLens.Preprocessing.TweetsPreprocessor.ProcessTweetParallel(this);
        }

    }
}
