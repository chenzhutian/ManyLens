using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ManyLens.Models
{

    public class Term : TweetSet
    {
        private string id;
        private DateTime termDate;
        private bool isTweetBurstPoint;//1 = this day is a burst point or 0=not in terms of tweetFreq or smoothedTweetFreq
        private double tweetBurstCutoff;//cutoff of tweet
        
        private uint pointType = 0; // 1 = start, 2 = end, 3 = start+end, 4 = inside
        private string begPoint;
        private string endPoint;
        private bool isPeak = false;
        private double virtualCount = -1;
        private double tempVirtualCount = 0;

        #region Getter & Setter
        public String ID
        {
            get
            {
                return this.id;
            }
        }
        public double VirtualCount
        {
            get
            {
                if (virtualCount == -1)
                    return this.TweetsCount;
                return this.virtualCount;
            }
        }
        public double TempVirtualCount
        {
            get
            {
                return this.tempVirtualCount;
            }
            set
            {
                this.tempVirtualCount = value;
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

        #endregion

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

        //public new void AddTweet(string id, string content, DateTime date,double lon, double lat, User user)
        //{
        //    base.AddTweet(id, content,date,lon, lat,user);
        //}

        public void GaussinBlurDone()
        {
            
            this.virtualCount = this.tempVirtualCount;
            this.tempVirtualCount = 0;
        }

    }
}
