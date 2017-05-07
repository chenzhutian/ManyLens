﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;

namespace Models
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
        private bool isFake = false;
        private bool withinInterval = false;
        private int fakeTweetsCount = 0;

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
        public Boolean WithinInterval
        {
            get { return this.withinInterval; }
            set { this.withinInterval = value; }
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
                if (this.isFake) return this.fakeTweetsCount;
                // Debug.WriteLine("Before preproccessing:" + this.Tweets.Count);


                if (this.HasPreprocessed) return this.Tweets.Count;
                this.PreproccessingParallel();
                // Debug.WriteLine("After preproccessing:" + this.Tweets.Count);
                return this.Tweets.Count;
            }
        }

        #endregion
        public Term(string date)
            : base()
        {
            string formatString = "yyyyMMddHHmmss";
            this.TermDate = DateTime.ParseExact(date, formatString, null);
            this.id = date;//date.ToString("yyyyMMddHHmmss");
        }

        public Term(string date, bool isFake, int tweetsCount)
            : base()
        {
            string formatString = "yyyyMMddHHmmss";
            this.TermDate = DateTime.ParseExact(date, formatString, null);
            this.id = date;//date.ToString("yyyyMMddHHmmss");
            this.isFake = isFake;
            this.fakeTweetsCount = tweetsCount;
        }

        public Term(DateTime date)
            : base()
        {
            this.TermDate = date;
            this.id = date.ToString("yyyyMMddHHmmss");
        }

        public new void AddTweet(Tweet tweet)
        {
            base.AddTweet(tweet);
        }

        public List<VoronoiTweetsFeature> GetVoronoiTweetsFeatures()
        {
            List<VoronoiTweetsFeature> features = new List<VoronoiTweetsFeature>();
            string follower = "follower";
            // string following = "following";
            // string tweetLength = "tweetLength";
            // string hastagCount = "hastagCount";
            string isV = "isV";
            //string isRetweet = "isRetweet";
            //string kloutScore = "kloutScore";
            //string tweetsCount = "tweetsCount";
            string sentiment = "sentiment";
            int sampleCount = (int)(this.TweetsCount * 0.001);
            if (sampleCount < 20) sampleCount = 20;
            Random rnd = new Random();

            Dictionary<Tweet, double> tweetsScore = new Dictionary<Tweet, double>();
            this.Tweets.ForEach(t =>
            {
                double score = t.User.KloutScore;//t.User.Follower / (1+Math.Log( t.User.Following +1));
                tweetsScore.Add(t, score);
            });

            foreach (KeyValuePair<Tweet, double> item in tweetsScore.OrderByDescending(t => t.Value).Take(sampleCount).ToList())
            {
                Tweet t = item.Key;
                features.Add(new VoronoiTweetsFeature() { id = t.TweetID + "_0", feature_type = follower, feature_value = t.User.Follower });
                features.Add(new VoronoiTweetsFeature() { id = t.TweetID + "_1", feature_type = isV, feature_value = t.User.IsV ? 1 : 0 });
                // features.Add(new VoronoiTweetsFeature() { id = t.TweetID + "_2", feature_type = tweetLength, feature_value = t.Length });
                // features.Add(new VoronoiTweetsFeature() { id = t.TweetID + "_2", feature_type = isRetweet, feature_value = t.SourceUserName != null ? 1 : 0, feature_detail = t.SourceUserName });
                // features.Add(new VoronoiTweetsFeature() { id = t.TweetID + "_3", feature_type = hastagCount, feature_value = t.HashTag.Count == 0 ? 0 : 1 });
                // features.Add(new VoronoiTweetsFeature() { id = t.TweetID + "_2", feature_type = kloutScore, feature_value = (int)(t.User.KloutScore) });
                // features.Add(new VoronoiTweetsFeature() { id = t.TweetID + "_3", feature_type = tweetsCount, feature_value = t.User.TweetsCount });
                features.Add(new VoronoiTweetsFeature() { id = t.TweetID + "_3", feature_type = sentiment, feature_value = t.Sentiment, feature_detail = t.OriginalContent });
            }

            return features.OrderBy(t => t.feature_type).ToList();
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
