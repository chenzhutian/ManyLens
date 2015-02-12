using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class Vocabulary
    {
        private Dictionary<string, int> idOfWords = null;
        private Dictionary<string, int> dfOfWords = null;

        #region Getter&Setter
        public Dictionary<string, int> IdOfWords
        {
            get
            {
                return this.idOfWords;
            }
            private set
            {
                this.idOfWords = value;
            }
        }
        public Dictionary<string, int> DfOfWords
        {
            get
            {
                return this.dfOfWords;
            }
            private set
            {
                this.dfOfWords = value;
            }
        }
        public int Dimension
        {
            get
            {
                if (idOfWords != null)
                    return idOfWords.Count;
                return -1;
            }
        }
        #endregion

        public Vocabulary(Dictionary<string, int> idOfWrods, Dictionary<string, int> dfOfWords)
        {
            this.IdOfWords = idOfWrods;
            this.DfOfWords = dfOfWords;

        }
        public int GetIDofWord(string word)
        {
            if (this.idOfWords == null)
                return -1;
            return this.idOfWords[word];
        }
        public int GetDFofWord(string word)
        {
            if (this.dfOfWords == null)
                return -1;
            return this.dfOfWords[word];
        }
    }
}