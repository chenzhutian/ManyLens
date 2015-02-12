using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ManyLens.Models
{

    public class Term : TweetSet
    {

        private DateTime termDate;
        private bool isTweetBurstPoint;//1 = this day is a burst point or 0=not in terms of tweetFreq or smoothedTweetFreq
        private double tweetBurstCutoff;//cutoff of tweet
        private uint pointType = 0; // 1 = start, 2 = end, 3 = start+end, 4 = inside
        private bool isPeak = false;

        #region Getter & Setter
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
        #endregion

        public Term(DateTime date)
            :base()
        {
            this.TermDate = date;
            this.SetDateTimeToID(date);
        }

        public void AddTweet(string id, string content)
        {
            base.AddTweet(id, content,this.termDate);
        }
    }
}
