using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class Interval : DerivedTweetSet
    {
        private string id;
        private DateTime beginDate;
        private DateTime endDate;
        private float[] rmMatrix;

        private bool hasVectorized = false;
        private bool hasPreprocessed = false;

        #region Getter & Setter
        public string ID
        {
            get
            {
                return this.id;
            }
        }
        public DateTime BeginDate
        {
            get
            {
                return this.beginDate;
            }
            private set
            {
                this.beginDate = value;
            }
        }
        public DateTime EndDate
        {
            get
            {
                return this.endDate;
            }
            set
            {
                this.endDate = value;
            }
        }
        public float[] RMMatrix
        {
            get
            {
                return this.rmMatrix;
            }
            set
            {
                this.rmMatrix = value;
            }
        }
        public bool HasVectorized
        {
            get
            {
                return this.hasVectorized;
            }
            set
            {
                if (value == true)
                    this.hasVectorized = value;
            }
        }
        public bool HasPreprocessed
        {
            get
            {
                return this.hasPreprocessed;
            }
            set
            {
                if (value == true)
                    this.hasPreprocessed = value;
            }
        }
        #endregion

        public Interval(DateTime beginDate, Term term)
            :base()
        {
            this.id = beginDate.ToString("yyyyMMddHHmmss");
            this.BeginDate = beginDate;
            this.Tweets.AddRange(term.Tweets);
        }

        public void AddTerm(Term term)
        {

            this.Tweets.AddRange(term.Tweets);
        }

    }
}