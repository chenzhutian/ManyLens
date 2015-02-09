using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ManyLens.Models
{

    public class Term : TweetSet
    {

        private DateTime termDate;
        private int isTweetBurstPoint;//1 = this day is a burst point or 0=not in terms of tweetFreq or smoothedTweetFreq
        private double tweetBurstCutoff;//cutoff of tweet
        private uint segmentPoint = 0; // 1 = start, 2 = end, 3 = start+end, 4 = inside

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
        public int IsTweetBurstPoint
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
        public uint SegmentPoint
        {
            get
            {
                return this.segmentPoint;
            }
            set
            {
                this.segmentPoint = value;
            }
        }
        #endregion

        private Term() { }

        public Term(string date)
            : base()
        {
            
            this.TermDate = DateTime.Parse(date);
            this.SetDateTimeToID(this.TermDate);
        }

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

        public void AddTweet(string id, string content, DateTime postDate)
        {
            if(!postDate.Equals(this.TermDate))
                throw new Exception("This tweet should not belong to this term! The date is wrong.");
            base.AddTweet(id, content, postDate);
        }

        public void AddTweet(string id, string content, string postDate)
        {
            if (!postDate.Equals(this.TermDate))
                throw new Exception("This tweet should not belong to this term! The date is wrong.");
            base.AddTweet(id, content, postDate);
        }

    }
}
