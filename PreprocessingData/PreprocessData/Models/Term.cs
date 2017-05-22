using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using Preprocessing;

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
            set
            {
                this.fakeTweetsCount = value;
                this.isFake = true;
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

        public void Preproccessing()
        {
            Preprocessing.TweetsPreprocessor.ProcessTweet(this);
        }

        public void PreproccessingParallel()
        {
            Preprocessing.TweetsPreprocessor.ProcessTweetParallel(this);
        }

    }
}
