using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Diagnostics;

namespace ManyLens.Models
{
    public abstract class DerivedTweetSet : TweetSet
    {
        private List<Dictionary<string, int>> sparseVector = null;
        private Vocabulary vocabulary = null;
        protected List<float[]> tfidfVectors = null;
        protected List<float[]> hashVectors = null;

        private bool hasPreprocessed = false;

        #region Getter&Setter
        public List<Dictionary<string, int>> SparseVector
        {
            get
            {
                return this.sparseVector;
            }
            set
            {
                this.sparseVector = value;
            }
        }
        public virtual Vocabulary Vocabulary
        {
            get
            {
                return this.vocabulary;
            }
            set
            {
                this.vocabulary = value;
            }
        }
        public int Dimension
        {
            get
            {
                return this.Vocabulary.Dimension;
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

        public int SaveTweetsCount
        {
            get
            {
                return this.Tweets.Count;
            }
        }
        #endregion

        protected DerivedTweetSet()
            : base()
        {
            this.sparseVector = new List<Dictionary<string, int>>();
        }

        public int GetIDofWord(string word)
        {
            if (this.Vocabulary == null)
                return -1;
            return this.Vocabulary.GetIDofWord(word);
        }

        protected int GetDFofWord(string word)
        {
            if (this.Vocabulary == null)
                return -1;
            return this.Vocabulary.GetDFofWord(word);
        }

        public string GetTweetDerivedContentAt(int index)
        {
            return this.Tweets[index].DerivedContent;
        }
    }
}